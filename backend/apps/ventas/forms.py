# apps/ventas/forms.py
from django import forms
from .models import Cliente, Venta

class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = ['nombre', 'apellido', 'email', 'telefono', 'direccion']

class VentaForm(forms.ModelForm):
    class Meta:
        model = Venta
        fields = ['id_cliente', 'fecha', 'total', 'metodo_pago', 'estado']
