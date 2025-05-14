from rest_framework import serializers
from .models import Categorie, Produit, Stock, Achat, AchatDetail, Vente, VenteDetail


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class ProduitSerializer(serializers.ModelSerializer):
    categorie_produit_nom = serializers.CharField(source='categorie_produit.nom', read_only=True)

    class Meta:
        model = Produit
        fields = [
            'id',   
            'nom_produit',
            'categorie_produit', 
            'categorie_produit_nom',
            'unite',
            'date_ajout',
            'prix_unitaire',
            'seuil_alerte',
        ]


class StockSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source='produit.nom_produit')
    produit_categorie = serializers.CharField(source='produit.categorie_produit.nom')
    produit_unite = serializers.CharField(source='produit.unite')
    seuil_alerte = serializers.IntegerField(source='produit.seuil_alerte')
    etat = serializers.ReadOnlyField()

    class Meta:
        model = Stock
        fields = [
            'id', 'produit_nom', 'produit_categorie', 'produit_unite',
            'quantite', 'date_entree', 'date_sortie', 'seuil_alerte', 'etat'
        ]


class AchatDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AchatDetail
        fields = '__all__'


class AchatSerializer(serializers.ModelSerializer):
    details = AchatDetailSerializer(many=True, read_only=True, source='achatdetail_set')

    class Meta:
        model = Achat
        fields = '__all__'


class VenteDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenteDetail
        fields = '__all__'


class VenteSerializer(serializers.ModelSerializer):
    details = VenteDetailSerializer(many=True, read_only=True, source='ventedetail_set')

    class Meta:
        model = Vente
        fields = '__all__'
