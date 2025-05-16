from django.urls import path
from .views import LoginView, current_user

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('me/', current_user, name='current_user'),  
]
