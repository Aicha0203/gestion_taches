from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import UtilisateurSerializer

Utilisateur = get_user_model()

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Seul l'utilisateur peut voir et modifier son propre profil
        return self.queryset.filter(id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        """Mise à jour complète du profil (PUT)"""
        kwargs['partial'] = False
        return self.partial_update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Mise à jour partielle du profil (PATCH)"""
        kwargs['partial'] = True
        return super().partial_update(request, *args, **kwargs)
