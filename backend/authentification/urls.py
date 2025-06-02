from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import LoginView, current_user, user_list, create_user, toggle_user_active

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('me/', current_user, name='current_user'),
    path('users/', user_list, name='user-list'),              # ✅ Liste des utilisateurs
    path('users/create/', create_user, name='user-create'),   # ✅ Création d'utilisateur

    # Endpoints JWT
    path('users/<int:user_id>/toggle_active/', toggle_user_active, name='toggle_user_active'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
