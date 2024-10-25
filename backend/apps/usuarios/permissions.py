# apps/usuarios/permissions.py
from rest_framework import permissions

class EsAdministrador(permissions.BasePermission):
    """
    Permite acceso solo a usuarios administradores.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo_usuario == 'administrador'

class EsCajero(permissions.BasePermission):
    """
    Permite acceso a usuarios cajeros y administradores.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipo_usuario in ['administrador', 'cajero']

class AccionesInventarioPermission(permissions.BasePermission):
    """
    Permisos específicos para acciones de inventario.
    """
    SAFE_METHODS = ['POST','GET', 'HEAD', 'OPTIONS']
    CAJERO_METHODS = ['POST','GET', 'HEAD', 'OPTIONS', 'PATCH']
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.tipo_usuario == 'administrador':
            return True

        if request.user.tipo_usuario == 'cajero':
            return request.method in self.CAJERO_METHODS

        return False

class VentasPermission(permissions.BasePermission):
    """
    Permisos específicos para ventas.
    """
    SAFE_METHODS = ['POST','GET', 'HEAD', 'OPTIONS']
    CAJERO_METHODS = ['POST','GET', 'HEAD', 'OPTIONS', 'PATCH']
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.tipo_usuario == 'administrador':
            return True

        if request.user.tipo_usuario == 'cajero':
            return request.method in self.CAJERO_METHODS

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.tipo_usuario == 'administrador':
            return True

        # Cajeros solo pueden ver y modificar sus propias ventas
        if request.user.tipo_usuario == 'cajero':
            return obj.id_usuario == request.user.id and request.method in self.CAJERO_METHODS

        return False

class ClientePermission(permissions.BasePermission):
    """
    Permisos específicos para el manejo de clientes.
    """
    SAFE_METHODS = ['POST','GET', 'HEAD', 'OPTIONS']
    CAJERO_METHODS = ['POST','GET', 'HEAD', 'OPTIONS', 'PATCH']
    CAJERO_FIELDS = {'nombre', 'apellido', 'telefono', 'email'}
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.tipo_usuario == 'administrador':
            return True

        if request.user.tipo_usuario == 'cajero':
            if hasattr(view, 'action') and view.action in ['exportar_clientes', 'marcar_vip']:
                return False
            return request.method in self.CAJERO_METHODS

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.tipo_usuario == 'administrador':
            return True

        if request.user.tipo_usuario == 'cajero':
            if request.method == 'PATCH':
                # Verificar que solo se estén modificando campos permitidos
                return all(field in self.CAJERO_FIELDS for field in request.data.keys())
            return request.method in self.SAFE_METHODS

        return False

