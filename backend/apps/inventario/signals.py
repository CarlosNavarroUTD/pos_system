from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=MovimientoInventario)
def notificar_stock_bajo(sender, instance, **kwargs):
    if instance.id_producto.necesita_reposicion():
        # Enviar notificación
        pass