from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategorieViewSet,
    ProduitViewSet,
    StockViewSet,
    AchatViewSet,
    AchatDetailViewSet,
    VenteViewSet,
    VenteCreateView,
    VenteDetailViewSet,
    ajouter_stock  # ✅ N'oublie pas d'importer ta vue personnalisée
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
    path('ventes/create/', VenteCreateView.as_view(), name='vente-create'),
    path('stocks/<int:pk>/ajouter-stock/', ajouter_stock, name='ajouter-stock'),  # ✅ Ajoute cette ligne
]
