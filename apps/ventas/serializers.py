# apps/ventas/serializers.py 
from rest_framework import serializers
from .models import Cliente, Venta, DetalleVenta
from apps.usuarios.serializers import UsuarioSerializer
from apps.inventario.serializers import ProductoSerializer

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id_cliente', 'nombre', 'apellido', 'email', 'telefono', 'direccion']

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(source='id_producto', read_only=True)

    class Meta:
        model = DetalleVenta
        fields = ['id_detalle', 'producto', 'cantidad', 'precio_unitario', 'subtotal']
        read_only_fields = ['id_detalle']

class VentaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)
    cliente = ClienteSerializer(source='id_cliente', read_only=True)
    detalles = DetalleVentaSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = ['id_venta', 'usuario', 'cliente', 'fecha', 'total', 'metodo_pago', 'estado', 'detalles']
        read_only_fields = ['id_venta']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        venta = Venta.objects.create(**validated_data)
        for detalle_data in detalles_data:
            DetalleVenta.objects.create(id_venta=venta, **detalle_data)
        return venta

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance