from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'role': user.role,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    if request.user.role != 'admin':
        return Response({"detail": "Permission refusée : seuls les administrateurs peuvent créer un utilisateur."},
                        status=status.HTTP_403_FORBIDDEN)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data.get('username')
        password = request.data.get('password')  # Le mot de passe doit être transmis séparément

        if not password:
            return Response({"password": ["Ce champ est requis."]}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            password=password,
            role=serializer.validated_data.get('role', 'employe'),
            is_active=serializer.validated_data.get('is_active', True)
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Identifiants invalides"}, status=status.HTTP_401_UNAUTHORIZED)
