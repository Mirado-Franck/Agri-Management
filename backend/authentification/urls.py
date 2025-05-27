from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import LoginView, current_user

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('me/', current_user, name='current_user'),

    # Endpoints JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),       # Pour obtenir access + refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),      # Pour rafraîchir le token access
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),         # Pour vérifier un token JWT
]
