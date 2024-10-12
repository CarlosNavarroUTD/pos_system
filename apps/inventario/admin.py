from django.contrib import admin
from .models import Producto, MovimientoInventario

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id_producto', 'nombre', 'precio', 'stock', 'estado')
    list_filter = ('estado',)
    search_fields = ('nombre', 'descripcion')

@admin.register(MovimientoInventario)
class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ('id_movimiento', 'id_producto', 'id_usuario', 'tipo_movimiento', 'cantidad', 'fecha_movimiento')
    list_filter = ('tipo_movimiento', 'fecha_movimiento')
    search_fields = ('id_producto__nombre', 'id_usuario__nombre_usuario', 'descripcion')
    date_hierarchy = 'fecha_movimiento'