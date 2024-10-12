# apps/usuarios/serializers.py
from rest_framework import serializers
from .models import Usuario, Persona

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre_usuario', 'email', 'contrasena', 'tipo_usuario']
        extra_kwargs = {'contrasena': {'write_only': True}}

    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['id_persona', 'id_usuario', 'nombre', 'apellido']
