# app/usuarios/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
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


class CurrentUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # Obtener el usuario actual con sus datos relacionados
            usuario = request.user
            
            # Obtener los datos de persona relacionados
            try:
                persona = Persona.objects.get(usuario=usuario)
                persona_serializer = PersonaSerializer(persona)
                persona_data = persona_serializer.data
            except ObjectDoesNotExist:
                persona_data = None

            # Serializar datos del usuario
            usuario_serializer = UsuarioSerializer(usuario)
            response_data = {
                **usuario_serializer.data,
                'persona': persona_data,
                'permisos': {
                    'es_administrador': usuario.tipo_usuario == 'administrador',
                    'es_cajero': usuario.tipo_usuario in ['administrador', 'cajero'],
                    'puede_gestionar_inventario': usuario.tipo_usuario in ['administrador', 'cajero'],
                    'puede_gestionar_ventas': usuario.tipo_usuario in ['administrador', 'cajero'],
                    'puede_gestionar_clientes': True,  # Ajusta según tus necesidades
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Error al obtener datos del usuario', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request):
        try:
            usuario = request.user
            serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
            
            if serializer.is_valid():
                # Verificar permisos según el tipo de usuario
                if 'tipo_usuario' in request.data and not usuario.tipo_usuario == 'administrador':
                    return Response(
                        {'error': 'No tienes permisos para cambiar el tipo de usuario'},
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                serializer.save()
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': 'Error al actualizar datos del usuario', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Se requiere el token de actualización"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {"detail": "Sesión cerrada exitosamente"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Error al cerrar sesión", "detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
