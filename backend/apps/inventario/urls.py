# apps/inventario/urls.py 

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CategoriaViewSet, MovimientoInventarioViewSet

# Creamos un enrutador para gestionar las URLs automáticamente
router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'movimientos', MovimientoInventarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]