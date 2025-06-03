from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .serializers import VenteSerializer

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

class VenteCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VenteSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VenteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ventes = Vente.objects.all()
        serializer = VenteSerializer(ventes, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class AchatCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AchatSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AchatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        achats = Achat.objects.all()
        serializer = AchatSerializer(achats, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class AchatDetailViewSet(viewsets.ModelViewSet):
    queryset = AchatDetail.objects.all()
    serializer_class = AchatDetailSerializer