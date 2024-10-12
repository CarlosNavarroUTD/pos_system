from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Persona

class PersonaInline(admin.StackedInline):
    model = Persona
    can_delete = False
    verbose_name_plural = 'Información Personal'

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('email', 'nombre_usuario', 'tipo_usuario', 'is_active', 'is_staff')
    list_filter = ('tipo_usuario', 'is_active', 'is_staff')
    search_fields = ('email', 'nombre_usuario')
    ordering = ('email',)
    
    # Campos para cuando se crea/edita un usuario
    fieldsets = (
        (None, {'fields': ('email', 'nombre_usuario', 'contrasena')}),
        ('Información de Acceso', {'fields': ('tipo_usuario',)}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    # Campos para cuando se crea un nuevo usuario
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre_usuario', 'tipo_usuario', 'password1', 'password2'),
        }),
    )
    
    inlines = [PersonaInline]

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'id_usuario')
    search_fields = ('nombre', 'apellido')
    list_filter = ('id_usuario__tipo_usuario',)