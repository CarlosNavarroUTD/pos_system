# apps/ventas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, VentaViewSet, DetalleVentaViewSet

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'ventas', VentaViewSet)
router.register(r'detalles', DetalleVentaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
