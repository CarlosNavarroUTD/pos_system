# apps/inventario/models.py
from django.db import models
from django.core.exceptions import ValidationError
from decimal import Decimal
from django.utils import timezone

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    class Meta:
        db_table = 'Categoria'

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    codigo_barras = models.CharField(max_length=50, unique=True, null=True, blank=True)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    stock_minimo = models.IntegerField(default=5)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, null=True, blank=True)
    estado = models.CharField(
        max_length=10,
        choices=[
            ('activo', 'Activo'),
            ('inactivo', 'Inactivo')
        ],
        default='activo'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.stock < 0:
            raise ValidationError('El stock no puede ser negativo')
        if self.precio < Decimal('0.00'):
            raise ValidationError('El precio no puede ser negativo')

    def necesita_reposicion(self):
        return self.stock <= self.stock_minimo

    class Meta:
        db_table = 'Producto'
        indexes = [
            models.Index(fields=['codigo_barras']),
            models.Index(fields=['nombre']),
        ]

class MovimientoInventario(models.Model):
    ENTRADA = 'entrada'
    SALIDA = 'salida'
    AJUSTE = 'ajuste'
    
    TIPO_MOVIMIENTO_CHOICES = [
        (ENTRADA, 'Entrada'),
        (SALIDA, 'Salida'),
        (AJUSTE, 'Ajuste de inventario')
    ]

    id_movimiento = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey(
        Producto, 
        on_delete=models.PROTECT,
        related_name='movimientos'
    )
    id_usuario = models.ForeignKey(
        'usuarios.Usuario', 
        on_delete=models.PROTECT,
        related_name='movimientos_inventario'
    )
    tipo_movimiento = models.CharField(
        max_length=10,
        choices=TIPO_MOVIMIENTO_CHOICES
    )
    cantidad = models.IntegerField()
    stock_anterior = models.IntegerField(default=0)
    stock_nuevo = models.IntegerField(default=0)
    fecha_movimiento = models.DateTimeField(default=timezone.now)
    descripcion = models.TextField()
    numero_documento = models.CharField(max_length=50, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Guardar el stock anterior
        self.stock_anterior = self.id_producto.stock
        
        # Actualizar el stock del producto
        if self.tipo_movimiento == self.ENTRADA:
            self.id_producto.stock += self.cantidad
        elif self.tipo_movimiento == self.SALIDA:
            self.id_producto.stock -= self.cantidad
        elif self.tipo_movimiento == self.AJUSTE:
            self.id_producto.stock = self.cantidad

        # Guardar el nuevo stock
        self.stock_nuevo = self.id_producto.stock
        
        # Validar que el stock no sea negativo
        if self.id_producto.stock < 0:
            raise ValidationError('No hay suficiente stock disponible')
            
        self.id_producto.save()
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Movimiento_Inventario'
        indexes = [
            models.Index(fields=['fecha_movimiento']),
            models.Index(fields=['tipo_movimiento']),
        ]