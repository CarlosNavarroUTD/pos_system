# apps/inventario/serializers.py 
from rest_framework import serializers
from .models import Producto, Categoria, MovimientoInventario
from apps.usuarios.serializers import UsuarioSerializer

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = [
            'id_producto', 'codigo_barras', 'nombre', 'descripcion',
            'precio', 'stock', 'stock_minimo', 'categoria', 'categoria_nombre',
            'estado', 'fecha_creacion', 'fecha_actualizacion'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo")
        return value

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0")
        return value

class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(source='id_producto', read_only=True)
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)
    
    class Meta:
        model = MovimientoInventario
        fields = [
            'id_movimiento', 'producto', 'usuario', 'tipo_movimiento',
            'cantidad', 'stock_anterior', 'stock_nuevo', 'fecha_movimiento',
            'descripcion', 'numero_documento'
        ]
        read_only_fields = ['id_movimiento', 'stock_anterior', 'stock_nuevo']

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value