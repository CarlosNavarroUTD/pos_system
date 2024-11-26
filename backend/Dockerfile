FROM python:3.9-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Crear directorio para archivos estáticos y dar permisos
RUN mkdir -p /app/staticfiles && \
    chmod -R 755 /app/staticfiles

EXPOSE 8000

# El comando se sobrescribirá en docker-compose.override.yml
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]

