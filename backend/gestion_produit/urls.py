from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategorieViewSet)
router.register(r'produits', views.ProduitViewSet)
router.register(r'stocks', views.StockViewSet)
router.register(r'achats-details', views.AchatDetailViewSet)
router.register(r'ventes-details', views.VenteDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('achats/create/', views.AchatCreateView.as_view(), name='achat-create'),
    path('achats/', views.AchatListView.as_view(), name='achat-list'),
    path('ventes/create/', views.VenteCreateView.as_view(), name='vente-create'),
    path('ventes/', views.VenteListView.as_view(), name='vente-list'),
    path('stocks/<int:pk>/ajouter/', views.ajouter_stock, name='ajouter-stock'),
    path('stocks/update/', views.update_stock, name='update-stock'),  # Nouvel endpoint pour update stocks 📉
]