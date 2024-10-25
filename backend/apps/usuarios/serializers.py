# backend/apps/usuarios/serializers.py

from rest_framework import serializers
from .models import Usuario, Persona

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['id_persona', 'nombre', 'apellido']

class UsuarioSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre_usuario', 'email', 'tipo_usuario', 'password', 'persona']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        persona_data = validated_data.pop('persona', None)
        password = validated_data.pop('password')
        usuario = Usuario.objects.create_user(**validated_data)
        usuario.set_password(password)
        usuario.save()

        if persona_data:
            Persona.objects.create(usuario=usuario, **persona_data)

        return usuario

    def update(self, instance, validated_data):
        persona_data = validated_data.pop('persona', None)
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if persona_data and hasattr(instance, 'persona'):
            for attr, value in persona_data.items():
                setattr(instance.persona, attr, value)
            instance.persona.save()
        elif persona_data:
            Persona.objects.create(usuario=instance, **persona_data)

        return instance