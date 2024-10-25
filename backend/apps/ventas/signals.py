# apps/ventas/signals.py
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Venta, DetalleVenta
from django.db import transaction
from django.core.exceptions import ValidationError

@receiver(pre_save, sender=DetalleVenta)
def validar_stock(sender, instance, **kwargs):
    if not instance.id_detalle:  # Solo para nuevos detalles
        producto = instance.id_producto
        if producto.stock < instance.cantidad:
            raise ValidationError(f'Stock insuficiente para el producto {producto.nombre}')

@receiver(post_save, sender=DetalleVenta)
def actualizar_stock(sender, instance, created, **kwargs):
    if created:  # Solo cuando se crea un nuevo detalle
        with transaction.atomic():
            producto = instance.id_producto
            producto.stock -= instance.cantidad
            producto.save()

@receiver(post_save, sender=Venta)
def actualizar_total_venta(sender, instance, **kwargs):
    instance.actualizar_total()
    instance.save()