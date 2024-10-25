# apps/inventario/admin.py 

from django.contrib import admin
from .models import Producto, Categoria, MovimientoInventario

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('codigo_barras', 'nombre', 'categoria', 'precio', 'stock', 'stock_minimo', 'estado', 'necesita_reposicion')
    list_filter = ('categoria', 'estado')
    search_fields = ('codigo_barras', 'nombre', 'descripcion')
    list_editable = ('precio', 'stock_minimo')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    fieldsets = (
        ('Información Básica', {
            'fields': ('codigo_barras', 'nombre', 'descripcion', 'categoria')
        }),
        ('Inventario', {
            'fields': ('precio', 'stock', 'stock_minimo', 'estado')
        }),
        ('Fechas', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )

    def necesita_reposicion(self, obj):
        return obj.necesita_reposicion()
    necesita_reposicion.boolean = True
    necesita_reposicion.short_description = 'Necesita Reposición'


@admin.register(MovimientoInventario)
class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ('id_movimiento', 'id_producto', 'tipo_movimiento', 
                   'cantidad', 'stock_anterior', 'stock_nuevo', 'fecha_movimiento')
    list_filter = ('tipo_movimiento', 'fecha_movimiento', 'id_producto__categoria')
    search_fields = ('id_producto__nombre', 'id_usuario__username', 'descripcion', 'numero_documento')
    readonly_fields = ('stock_anterior', 'stock_nuevo')
    date_hierarchy = 'fecha_movimiento'
    raw_id_fields = ('id_producto', 'id_usuario')