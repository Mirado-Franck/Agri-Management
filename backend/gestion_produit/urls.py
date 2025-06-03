from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategorieViewSet,
    ProduitViewSet,
    StockViewSet,
    AchatDetailViewSet,
    VenteCreateView,
    VenteListView,
    AchatCreateView,
    AchatListView,
    ajouter_stock
)

router = DefaultRouter()
router.register(r'categories', CategorieViewSet)
router.register(r'produits', ProduitViewSet)
router.register(r'stocks', StockViewSet)
router.register(r'achat-details', AchatDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('ventes/create/', VenteCreateView.as_view(), name='vente-create'),
    path('ventes/', VenteListView.as_view(), name='vente-list'),
    path('achats/create/', AchatCreateView.as_view(), name='achat-create'),
    path('achats/', AchatListView.as_view(), name='achat-list'),
    path('stocks/<int:pk>/ajouter-stock/', ajouter_stock, name='ajouter-stock'),
]