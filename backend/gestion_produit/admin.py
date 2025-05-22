from django.contrib import admin
from .models import Produit, Stock, Categorie, Vente, VenteDetail

# Produits, Stocks, Catégories (déjà enregistrés)
admin.site.register(Produit)
admin.site.register(Stock)
admin.site.register(Categorie)

# 👇 Inline pour afficher les détails d'une vente
class VenteDetailInline(admin.TabularInline):
    model = VenteDetail
    extra = 0

# Vente avec ses détails dans la même page
@admin.register(Vente)
class VenteAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'user', 'date', 'total')
    list_filter = ('date', 'user')
    search_fields = ('client',)
    inlines = [VenteDetailInline]  # 👈 pour voir les produits de la vente

# Enregistrement direct de VenteDetail aussi (optionnel)
@admin.register(VenteDetail)
class VenteDetailAdmin(admin.ModelAdmin):
    list_display = ('vente', 'produit', 'quantite', 'prix_unitaire')
