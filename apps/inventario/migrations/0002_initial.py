# Generated by Django 5.1.1 on 2024-10-05 21:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventario', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='movimientoinventario',
            name='id_usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos_inventario', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='movimientoinventario',
            name='id_producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos', to='inventario.producto'),
        ),
    ]
