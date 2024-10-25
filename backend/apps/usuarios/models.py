# apps/usuarios/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Custom manager for the Usuario model
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.AutoField(primary_key=True)  # Primary key defined as id_usuario
    nombre_usuario = models.CharField(max_length=255, unique=True)  # Unique constraint
    email = models.EmailField(unique=True)  # Unique constraint
    contrasena = models.CharField(max_length=255)  # This will store the password
    tipo_usuario = models.CharField(max_length=20, choices=[
        ('administrador', 'Administrador'),
        ('cajero', 'Cajero'),
    ])
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre_usuario', 'tipo_usuario']

    class Meta:
        db_table = 'Usuario'  # Link to your SQL table
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.email

class Persona(models.Model):
    id_persona = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)  # Foreign key relation
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)

    class Meta:
        db_table = 'Persona'  # Link to your SQL table
        verbose_name = 'Persona'
        verbose_name_plural = 'Personas'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


