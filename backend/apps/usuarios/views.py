# app/usuarios/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Usuario, Persona
from .serializers import UsuarioSerializer, PersonaSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.is_staff

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Usuario.objects.all()
        return Usuario.objects.filter(id_usuario=self.request.user.id_usuario)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Persona.objects.all()
        return Persona.objects.filter(usuario=self.request.user)