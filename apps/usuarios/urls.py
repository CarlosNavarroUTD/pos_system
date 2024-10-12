# apps/usuarios/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, PersonaViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'personas', PersonaViewSet)

app_name = 'usuarios'

urlpatterns = [
    path('', include(router.urls)),
]