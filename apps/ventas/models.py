# apps/ventas/models.py
from django.db import models
from apps.usuarios.models import Usuario
from apps.inventario.models import Producto

class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    email = models.EmailField()
    telefono = models.CharField(max_length=255)
    direccion = models.TextField()

    class Meta:
        db_table = 'Cliente'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Venta(models.Model):
    id_venta = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        Usuario, 
        on_delete=models.CASCADE,
        related_name='ventas'
    )
    id_cliente = models.ForeignKey(
        Cliente, 
        on_delete=models.CASCADE,
        related_name='ventas'
    )
    fecha = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(
        max_length=15,
        choices=[
            ('efectivo', 'Efectivo'),
            ('tarjeta', 'Tarjeta'),
            ('transferencia', 'Transferencia')
        ]
    )
    estado = models.CharField(
        max_length=10,
        choices=[
            ('completada', 'Completada'),
            ('cancelada', 'Cancelada')
        ]
    )

    class Meta:
        db_table = 'Venta'
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'

    def __str__(self):
        return f"Venta {self.id_venta} - {self.id_cliente}"

class DetalleVenta(models.Model):
    id_detalle = models.AutoField(primary_key=True)
    id_venta = models.ForeignKey(
        Venta, 
        on_delete=models.CASCADE,
        related_name='detalles'
    )
    id_producto = models.ForeignKey(
        Producto, 
        on_delete=models.CASCADE,
        related_name='detalles_venta'
    )
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'Detalle_Venta'
        verbose_name = 'Detalle de Venta'
        verbose_name_plural = 'Detalles de Venta'

    def __str__(self):
        return f"Detalle {self.id_detalle} - Venta {self.id_venta}"