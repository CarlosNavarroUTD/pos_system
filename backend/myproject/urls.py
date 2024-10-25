#backend/myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', include('apps.usuarios.urls')),
    path('api/ventas/', include('apps.ventas.urls')),
    path('api/inventario/', include('apps.inventario.urls')),  # Nueva línea
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]