# apps/inventario/serializers.py 
from rest_framework import serializers
from .models import Producto, MovimientoInventario
from apps.usuarios.serializers import UsuarioSerializer

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id_producto', 'nombre', 'descripcion', 'precio', 'stock', 'estado']

class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(source='id_producto', read_only=True)
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = ['id_movimiento', 'producto', 'usuario', 'tipo_movimiento', 'cantidad', 'fecha_movimiento', 'descripcion']
        read_only_fields = ['id_movimiento']

    def create(self, validated_data):
        return MovimientoInventario.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance