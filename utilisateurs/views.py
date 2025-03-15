from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import viewsets, permissions, status
from django.contrib.auth import get_user_model

from taches.models import Tache
from .serializers import UtilisateurSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action

Utilisateur = get_user_model()

def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all().order_by("id")
    serializer_class = UtilisateurSerializer
    lookup_field = "id"

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Utilisateur créé avec succès.",
                "user": UtilisateurSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get", "patch"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        user = request.user

        if request.method == "PATCH":
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(self.get_serializer(user).data)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    email = request.data.get("email")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if not email or not new_password or not confirm_password:
        return Response({"error": "Tous les champs sont obligatoires"}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({"error": "Les mots de passe ne correspondent pas"}, status=status.HTTP_400_BAD_REQUEST)

    users = Utilisateur.objects.filter(email=email)
    if users.exists():
        for user in users:
            user.set_password(new_password)
            user.save()
        return Response({"message": "Mot de passe réinitialisé avec succès"}, status=status.HTTP_200_OK)

    return Response({"error": "Aucun compte trouvé avec cet email"}, status=status.HTTP_404_NOT_FOUND)

