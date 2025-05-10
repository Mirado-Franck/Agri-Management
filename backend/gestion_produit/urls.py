from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategorieViewSet,
    ProduitViewSet,
    StockViewSet,
    AchatViewSet,
    AchatDetailViewSet,
    VenteViewSet,
    VenteDetailViewSet
)

router = DefaultRouter()
router.register(r'categories', CategorieViewSet)
router.register(r'produits', ProduitViewSet)
router.register(r'stocks', StockViewSet)
router.register(r'achats', AchatViewSet)
router.register(r'achat-details', AchatDetailViewSet)
router.register(r'ventes', VenteViewSet)
router.register(r'vente-details', VenteDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
