# AXOLPOS

## Requisitos
- Docker
- Docker Compose

## Instalación
1. Clonar el repositorio
2. Copiar .env.example a .env y configurar las variables
3. Ejecutar `docker-compose up --build`

## Crear un superusuario manualmente
1. Ejecutar `docker-compose exec backend python manage.py createsuperuser`


## Crear migraciones manualmente
1. Ejecutar `docker-compose exec backend python manage.py migrate`

## Dar máquina de baja
1. Ejecutar `docker-compose down`
