# apps/inventario/forms.py 

from django import forms
from .models import Producto, MovimientoInventario, Categoria

class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = ['codigo_barras', 'nombre', 'descripcion', 'precio', 
                 'stock', 'stock_minimo', 'categoria', 'estado']
        
    def clean_stock(self):
        stock = self.cleaned_data.get('stock')
        if stock < 0:
            raise forms.ValidationError("El stock no puede ser negativo")
        return stock

    def clean_precio(self):
        precio = self.cleaned_data.get('precio')
        if precio <= 0:
            raise forms.ValidationError("El precio debe ser mayor a 0")
        return precio

class MovimientoInventarioForm(forms.ModelForm):
    class Meta:
        model = MovimientoInventario
        fields = ['id_producto', 'tipo_movimiento', 'cantidad', 
                 'descripcion', 'numero_documento']
        
    def clean_cantidad(self):
        cantidad = self.cleaned_data.get('cantidad')
        if cantidad <= 0:
            raise forms.ValidationError("La cantidad debe ser mayor a 0")
        return cantidad

    def clean(self):
        cleaned_data = super().clean()
        tipo_movimiento = cleaned_data.get('tipo_movimiento')
        cantidad = cleaned_data.get('cantidad')
        producto = cleaned_data.get('id_producto')
        
        if tipo_movimiento == MovimientoInventario.SALIDA and producto:
            if producto.stock < cantidad:
                raise forms.ValidationError(
                    "No hay suficiente stock disponible"
                )
        
        return cleaned_data

class CategoriaForm(forms.ModelForm):
    class Meta:
        model = Categoria
        fields = ['nombre', 'descripcion']