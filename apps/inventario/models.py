# apps/inventario/models.py
from django.db import models
from apps.usuarios.models import Usuario

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    estado = models.CharField(
        max_length=10,
        choices=[
            ('activo', 'Activo'),
            ('inactivo', 'Inactivo')
        ],
        default='activo'
    )

    class Meta:
        db_table = 'Producto'
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return self.nombre

class MovimientoInventario(models.Model):
    id_movimiento = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey(
        Producto, 
        on_delete=models.CASCADE,
        related_name='movimientos'
    )
    id_usuario = models.ForeignKey(
        Usuario, 
        on_delete=models.CASCADE,
        related_name='movimientos_inventario'
    )
    tipo_movimiento = models.CharField(
        max_length=10,
        choices=[
            ('entrada', 'Entrada'),
            ('salida', 'Salida')
        ]
    )
    cantidad = models.IntegerField()
    fecha_movimiento = models.DateField()
    descripcion = models.TextField()

    class Meta:
        db_table = 'Movimiento_Inventario'
        verbose_name = 'Movimiento de Inventario'
        verbose_name_plural = 'Movimientos de Inventario'

    def __str__(self):
        return f"{self.tipo_movimiento} - {self.id_producto.nombre} - {self.cantidad}"