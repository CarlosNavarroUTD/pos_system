from django.contrib import admin
from .models import Cliente, Venta, DetalleVenta

class DetalleVentaInline(admin.TabularInline):
    model = DetalleVenta
    extra = 1

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id_cliente', 'nombre', 'apellido', 'email', 'telefono')
    search_fields = ('nombre', 'apellido', 'email')

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ('id_venta', 'id_usuario', 'id_cliente', 'fecha', 'total', 'metodo_pago', 'estado')
    list_filter = ('fecha', 'metodo_pago', 'estado')
    search_fields = ('id_usuario__nombre_usuario', 'id_cliente__nombre', 'id_cliente__apellido')
    inlines = [DetalleVentaInline]

@admin.register(DetalleVenta)
class DetalleVentaAdmin(admin.ModelAdmin):
    list_display = ('id_detalle', 'id_venta', 'id_producto', 'cantidad', 'precio_unitario', 'subtotal')
    list_filter = ('id_venta__fecha',)
    search_fields = ('id_venta__id_venta', 'id_producto__nombre')