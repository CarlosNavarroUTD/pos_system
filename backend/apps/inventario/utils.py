# apps/inventario/utils.py 

from django.core.cache import cache

def get_producto_stock(producto_id):
    cache_key = f'producto_stock_{producto_id}'
    stock = cache.get(cache_key)
    if stock is None:
        stock = Producto.objects.get(id=producto_id).stock
        cache.set(cache_key, stock, timeout=300)  # 5 minutos
    return stock