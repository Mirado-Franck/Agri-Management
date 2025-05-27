from django.contrib import admin
from .models import Produit, Stock, Categorie, Vente, VenteDetail, Achat, AchatDetail

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
    inlines = [VenteDetailInline]

# Enregistrement direct de VenteDetail aussi (optionnel)
@admin.register(VenteDetail)
class VenteDetailAdmin(admin.ModelAdmin):
    list_display = ('vente', 'produit', 'quantite', 'prix_unitaire')

# 👇 Inline pour afficher les détails d'un achat
class AchatDetailInline(admin.TabularInline):
    model = AchatDetail
    extra = 1

# Achat avec ses détails intégrés
@admin.register(Achat)
class AchatAdmin(admin.ModelAdmin):
    list_display = ('id', 'fournisseur', 'user', 'date', 'total')
    list_filter = ('date', 'user')
    search_fields = ('fournisseur',)
    inlines = [AchatDetailInline]

# Enregistrement direct de AchatDetail aussi (optionnel)
@admin.register(AchatDetail)
class AchatDetailAdmin(admin.ModelAdmin):
    list_display = ('achat', 'produit', 'quantite', 'prix_unitaire')
