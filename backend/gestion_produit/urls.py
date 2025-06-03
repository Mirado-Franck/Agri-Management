from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategorieViewSet,
    ProduitViewSet,
    StockViewSet,
    AchatViewSet,
    AchatDetailViewSet,
    VenteCreateView,
    VenteListView,
    ajouter_stock
)

router = DefaultRouter()
router.register(r'categories', CategorieViewSet)
router.register(r'produits', ProduitViewSet)
router.register(r'stocks', StockViewSet)
router.register(r'achats', AchatViewSet)
router.register(r'achat-details', AchatDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('ventes/create/', VenteCreateView.as_view(), name='vente-create'),
    path('ventes/', VenteListView.as_view(), name='vente-list'),
    path('stocks/<int:pk>/ajouter-stock/', ajouter_stock, name='ajouter-stock'),
]