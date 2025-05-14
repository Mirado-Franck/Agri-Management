from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import Categorie, Produit, Stock, Achat, AchatDetail, Vente, VenteDetail
from .serializers import (
    CategorieSerializer,
    ProduitSerializer,
    StockSerializer,
    AchatSerializer,
    AchatDetailSerializer,
    VenteSerializer,
    VenteDetailSerializer
)

# ✅ Vue personnalisée pour ajouter du stock
@api_view(['POST'])
def ajouter_stock(request, pk):
    try:
        stock = Stock.objects.get(pk=pk)
    except Stock.DoesNotExist:
        return Response({'error': 'Stock introuvable'}, status=404)

    quantite = float(request.data.get('quantite', 0))
    stock.quantite += quantite
    stock.date_entree = timezone.now()
    stock.save()

    return Response({'message': 'Stock mis à jour avec succès'})

# ✅ ViewSets
class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class AchatViewSet(viewsets.ModelViewSet):
    queryset = Achat.objects.all()
    serializer_class = AchatSerializer

class AchatDetailViewSet(viewsets.ModelViewSet):
    queryset = AchatDetail.objects.all()
    serializer_class = AchatDetailSerializer

class VenteViewSet(viewsets.ModelViewSet):
    queryset = Vente.objects.all()
    serializer_class = VenteSerializer

class VenteDetailViewSet(viewsets.ModelViewSet):
    queryset = VenteDetail.objects.all()
    serializer_class = VenteDetailSerializer
