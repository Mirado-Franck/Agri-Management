from django.contrib import admin
from .models import Produit, Stock, Categorie

admin.site.register(Produit)
admin.site.register(Stock)
admin.site.register(Categorie)
