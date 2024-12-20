# apps/ventas/serializers.py 
from rest_framework import serializers
from .models import Cliente, Venta, DetalleVenta
from apps.usuarios.serializers import UsuarioSerializer
from apps.inventario.serializers import ProductoSerializer
from apps.inventario.models import Producto
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id_cliente', 'nombre', 'apellido', 'email', 'telefono', 'direccion']

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(source='id_producto', read_only=True)
    id_producto = serializers.PrimaryKeyRelatedField(
        write_only=True, 
        source='id_producto',
        queryset=Producto.objects.all()
    )

    class Meta:
        model = DetalleVenta
        fields = ['id_detalle', 'producto', 'id_producto', 'cantidad', 'precio_unitario', 'subtotal']
        read_only_fields = ['id_detalle', 'subtotal']

class VentaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)
    cliente = ClienteSerializer(source='id_cliente', read_only=True)
    detalles = DetalleVentaSerializer(many=True, required=False)
    id_cliente = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Venta
        fields = [
            'id_venta', 
            'usuario', 
            'cliente',
            'id_cliente', 
            'fecha', 
            'total', 
            'metodo_pago', 
            'estado', 
            'detalles'
        ]
        read_only_fields = ['id_venta', 'fecha', 'total']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        
        # Crear la venta
        venta = Venta.objects.create(**validated_data)
        
        # Crear los detalles
        for detalle_data in detalles_data:
            DetalleVenta.objects.create(
                id_venta=venta,
                **detalle_data
            )
        
        # Recalcular el total
        venta.total = sum(
            detalle.subtotal 
            for detalle in venta.detalles.all()
        )
        venta.save()
        
        return venta

