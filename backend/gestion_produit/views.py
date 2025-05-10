from django.shortcuts import render
from rest_framework import viewsets
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

