# settings/production.py
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['tudominio.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'tu_db_name',
        'USER': 'tu_db_user',
        'PASSWORD': 'tu_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Configuraciones adicionales de seguridad para producción
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
