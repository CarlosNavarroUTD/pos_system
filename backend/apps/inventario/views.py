# apps/inventario/views.py 
from django.db.models import Q
from django.db import transaction
from django.core.exceptions import ValidationError

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Producto,
    Categoria,
    MovimientoInventario
)
from .serializers import (
    ProductoSerializer,
    CategoriaSerializer,
    MovimientoInventarioSerializer
)
from apps.usuarios.permissions import (
    EsAdministrador,
    EsCajero,
    AccionesInventarioPermission
)

class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar productos.
    Proporciona operaciones CRUD y acciones adicionales para productos.
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    
    def get_permissions(self):
        """
        Permisos específicos por acción:
        - Crear/Eliminar/Actualización completa: solo administradores
        - Ver/Actualización parcial (stock): cajeros y administradores
        """
        if self.action in ['create', 'destroy', 'update']:
            permission_classes = [EsAdministrador]
        else:
            permission_classes = [AccionesInventarioPermission]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filtra productos según parámetros de búsqueda
        """
        queryset = Producto.objects.all()
        
        # Búsqueda por nombre o código
        busqueda = self.request.query_params.get('buscar', None)
        if busqueda:
            queryset = queryset.filter(
                Q(nombre__icontains=busqueda) |
                Q(codigo_barras__icontains=busqueda)
            )
        
        # Filtrar por categoría
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            queryset = queryset.filter(categoria=categoria)
            
        # Filtrar por estado
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)

        return queryset

    def perform_update(self, serializer):
        """
        Validación adicional para actualizaciones
        """
        if self.request.user.tipo_usuario == 'cajero':
            # Cajeros solo pueden actualizar el stock
            if set(self.request.data.keys()) - {'stock'}:
                raise ValidationError(
                    'Cajeros solo pueden actualizar el stock'
                )
        serializer.save()

    @action(detail=False, methods=['get'])
    @transaction.atomic
    def stock_bajo(self, request):
        """
        Lista productos con stock bajo el mínimo
        """
        productos = Producto.objects.filter(
            stock__lte=models.F('stock_minimo')
        )
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def registrar_movimiento(self, request, pk=None):
        """
        Registra un movimiento de inventario para el producto
        """
        producto = self.get_object()
        
        try:
            movimiento = MovimientoInventario.objects.create(
                id_producto=producto,
                id_usuario=request.user,
                tipo_movimiento=request.data.get('tipo_movimiento'),
                cantidad=request.data.get('cantidad'),
                descripcion=request.data.get('descripcion', ''),
                numero_documento=request.data.get('numero_documento')
            )
            
            return Response({
                'mensaje': 'Movimiento registrado exitosamente',
                'movimiento_id': movimiento.id_movimiento
            })
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar categorías.
    Solo administradores pueden crear/modificar/eliminar categorías.
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [EsAdministrador]

    def get_permissions(self):
        """
        Permite lectura a cajeros, pero solo administradores pueden modificar
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [EsCajero]
        else:
            permission_classes = [EsAdministrador]
        return [permission() for permission in permission_classes]

class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar movimientos de inventario.
    """
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer
    permission_classes = [AccionesInventarioPermission]

    def get_queryset(self):
        """
        Filtra movimientos según el rol del usuario
        """
        queryset = MovimientoInventario.objects.all()
        
        # Filtros por fecha
        fecha_inicio = self.request.query_params.get('fecha_inicio')
        fecha_fin = self.request.query_params.get('fecha_fin')
        if fecha_inicio and fecha_fin:
            queryset = queryset.filter(
                fecha_movimiento__range=[fecha_inicio, fecha_fin]
            )
            
        # Filtro por tipo de movimiento
        tipo = self.request.query_params.get('tipo')
        if tipo:
            queryset = queryset.filter(tipo_movimiento=tipo)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(id_usuario=self.request.user)