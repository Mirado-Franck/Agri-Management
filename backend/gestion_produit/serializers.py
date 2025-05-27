from rest_framework import serializers
from .models import Categorie, Produit, Stock, Achat, AchatDetail, Vente, VenteDetail
from django.contrib.auth import get_user_model

User = get_user_model()

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class ProduitSerializer(serializers.ModelSerializer):
    categorie_produit_nom = serializers.CharField(source='categorie_produit.nom', read_only=True)
    quantite_en_stock = serializers.SerializerMethodField()

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
            'quantite_en_stock',
        ]

    def get_quantite_en_stock(self, obj):
        stock = Stock.objects.filter(produit=obj).first()
        return stock.quantite if stock else 0

class StockSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source='produit.nom_produit')
    produit_categorie = serializers.CharField(source='produit.categorie_produit.nom')
    produit_unite = serializers.CharField(source='produit.unite')
    seuil_alerte = serializers.IntegerField(source='produit.seuil_alerte')

    class Meta:
        model = Stock
        fields = [
            'id', 'produit_nom', 'produit_categorie', 'produit_unite',
            'quantite', 'date_entree', 'date_sortie', 'seuil_alerte', 'etat'
        ]

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.update_etat()
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        instance.update_etat()
        return instance

class VenteDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenteDetail
        fields = ['produit', 'quantite', 'prix_unitaire']

class VenteSerializer(serializers.ModelSerializer):
    details = VenteDetailSerializer(many=True)
    user = serializers.SerializerMethodField()

    class Meta:
        model = Vente
        fields = ['id', 'date', 'client', 'total', 'user', 'details']
    
    def get_user(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "username": obj.user.username
            }
        return None

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        user = self.context['request'].user
        vente = Vente.objects.create(user=user, **validated_data)

        for detail in details_data:
            VenteDetail.objects.create(vente=vente, **detail)
        
        return vente

class AchatDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AchatDetail
        fields = '__all__'

class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class AchatSerializer(serializers.ModelSerializer):
    details = AchatDetailSerializer(many=True, read_only=True)
    user = UserMinimalSerializer(read_only=True)  # ✅ Affichage du username

    class Meta:
        model = Achat
        fields = ['id', 'date', 'fournisseur', 'user', 'total', 'details']
