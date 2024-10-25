# apps/ventas/views.py
from django.db.models import Sum, Avg, Q
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction

from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.inventario.models import (
    Producto, 
    MovimientoInventario,
)

from .models import (
    Cliente,    
    Venta,
    DetalleVenta,
)
from .serializers import (
    ClienteSerializer,
    VentaSerializer,
    DetalleVentaSerializer,
)
from apps.usuarios.permissions import (
    EsAdministrador,
    EsCajero,
    VentasPermission,
    ClientePermission,
)

class ClienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar clientes.
    Proporciona operaciones CRUD y acciones adicionales para clientes.
    """
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated, VentasPermission]
    
    def get_queryset(self):
        """
        Filtrar ventas basado en permisos de objeto
        """
        queryset = super().get_queryset()
        if self.request.user.tipo_usuario == 'cajero':
            return queryset.filter(id_usuario=self.request.user.id)
        return queryset


    def perform_create(self, serializer):
        """
        Guarda el usuario que crea el cliente
        """
        serializer.save(
            creado_por=self.request.user,
            ultima_modificacion_por=self.request.user
        )

    def perform_update(self, serializer):
        """
        Actualiza el usuario que modifica el cliente
        """
        serializer.save(ultima_modificacion_por=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        """
        Personaliza la actualización parcial para cajeros,
        limitando los campos que pueden modificar
        """
        if request.user.tipo_usuario == 'cajero':
            campos_permitidos = {'nombre', 'apellido', 'telefono', 'email'}
            datos_filtrados = {
                k: v for k, v in request.data.items() 
                if k in campos_permitidos
            }
            request.data.clear()
            request.data.update(datos_filtrados)
            
        return super().partial_update(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def exportar_clientes(self, request):
        """
        Endpoint para exportar datos de clientes.
        Solo accesible por administradores.
        """
        clientes = self.get_queryset()
        serializer = self.get_serializer(clientes, many=True)
        
        return Response({
            'mensaje': 'Exportación exitosa',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def marcar_vip(self, request, pk=None):
        """
        Marca un cliente como VIP.
        Solo administradores pueden realizar esta acción.
        """
        cliente = self.get_object()
        cliente.es_vip = True
        cliente.ultima_modificacion_por = request.user
        cliente.save()
        
        return Response({
            'mensaje': f'Cliente {cliente.nombre} marcado como VIP',
            'fecha_modificacion': cliente.fecha_modificacion
        })

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated, VentasPermission]  # Asegurarse que VentasPermission está bien definido
    

    def get_queryset(self):
        """
        Filtrar detalles basado en permisos de objeto de la venta
        """
        queryset = super().get_queryset()
        if self.request.user.tipo_usuario == 'cajero':
            return queryset.filter(venta__id_usuario=self.request.user.id)
        return queryset

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        print("Datos recibidos:", request.data)  # Debug
        print("Usuario:", request.user)  # Debug
        print("Método:", request.method)  # Debug
        
        try:
            detalles = request.data.get('detalles', [])
            self._validar_stock_disponible(detalles)
            
            data = request.data.copy()
            data['id_usuario'] = request.user.id
            
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            venta = serializer.instance
            self._procesar_movimientos_inventario(venta, detalles)
            
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED, 
                headers=headers
            )
            
        except Exception as e:
            print("Error en create:", str(e))  # Debug
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _validar_stock_disponible(self, detalles):
        """
        Valida que haya suficiente stock para todos los productos
        antes de procesar la venta.
        """
        product_ids = [detalle['id_producto'] for detalle in detalles]
        productos = Producto.objects.filter(id_producto__in=product_ids).select_related('inventario')
        for producto in productos:
            cantidad_solicitada = next(detalle['cantidad'] for detalle in detalles if detalle['id_producto'] == producto.id_producto)
            if producto.stock < cantidad_solicitada:
                raise ValidationError(f'Stock insuficiente para {producto.nombre}')


    def _procesar_movimientos_inventario(self, venta, detalles):
        """
        Crea los movimientos de inventario correspondientes
        para cada producto en la venta.
        """
        for detalle in detalles:
            producto = Producto.objects.get(id_producto=detalle['id_producto'])
            cantidad = detalle['cantidad']
            
            # Crear movimiento de salida en inventario
            MovimientoInventario.objects.create(
                id_producto=producto,
                id_usuario=self.request.user,
                tipo_movimiento=MovimientoInventario.SALIDA,
                cantidad=cantidad,
                descripcion=f'Venta #{venta.id}',
                numero_documento=f'V-{venta.id}'
            )

    @transaction.atomic
    def perform_create(self, serializer):
        """
        Guarda la venta con el usuario actual
        """
        serializer.save(
            id_usuario=self.request.user.id,
            creado_por=self.request.user
        )

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def cancelar(self, request, pk=None):
        """
        Cancela una venta y revierte los movimientos de inventario
        """
        venta = self.get_object()
        motivo = request.data.get('motivo', '')
        
        try:
            # Validar que la venta esté en estado válido para cancelación
            if venta.estado != 'completada':
                raise ValidationError('Solo se pueden cancelar ventas completadas')
                
            # Revertir movimientos de inventario
            self._revertir_movimientos_inventario(venta)
            
            # Cancelar la venta
            venta.estado = 'cancelada'
            venta.motivo_cancelacion = motivo
            venta.fecha_cancelacion = timezone.now()
            venta.cancelado_por = request.user
            venta.save()
            
            return Response({'status': 'Venta cancelada exitosamente'})
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _revertir_movimientos_inventario(self, venta):
        """
        Crea movimientos de entrada para revertir una venta cancelada
        """
        detalles = DetalleVenta.objects.filter(venta=venta)
        
        for detalle in detalles:
            # Crear movimiento de entrada para revertir la salida
            MovimientoInventario.objects.create(
                id_producto=detalle.producto,
                id_usuario=self.request.user,
                tipo_movimiento=MovimientoInventario.ENTRADA,
                cantidad=detalle.cantidad,
                descripcion=f'Reversión por cancelación de Venta #{venta.id}',
                numero_documento=f'RC-{venta.id}'
            )

class DetalleVentaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar detalles de venta.
    """
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer
    permission_classes = [VentasPermission]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        """
        Filtra detalles de venta según el rol del usuario
        """
        queryset = DetalleVenta.objects.all()
        if not self.request.user.tipo_usuario == 'administrador':
            queryset = queryset.filter(venta__id_usuario=self.request.user.id)
        return queryset

    def perform_create(self, serializer):
        """
        Guarda el usuario que crea el detalle de venta
        """
        serializer.save(creado_por=self.request.user)