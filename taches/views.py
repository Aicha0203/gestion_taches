from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from .models import Tache
from .serializers import TacheSerializer
from taches.permissions import IsAssigneeOrCreator

class TacheViewSet(viewsets.ModelViewSet):
    queryset = Tache.objects.all()
    serializer_class = TacheSerializer
    permission_classes = [permissions.IsAuthenticated, IsAssigneeOrCreator]

    def get_queryset(self):
        return Tache.objects.filter(
            projet__createur=self.request.user
        ) | Tache.objects.filter(assigne_a=self.request.user)

    def perform_create(self, serializer):
        """Créer une tâche uniquement pour les projets de l'utilisateur connecté"""
        projet = serializer.validated_data.get('projet')

        if projet is None:
            raise ValidationError({"projet": "Ce champ est obligatoire."})

        if projet.createur != self.request.user:
            raise ValidationError({"detail": "Vous ne pouvez créer des tâches que pour vos propres projets."})

        serializer.save(projet=projet)

    def update(self, request, *args, **kwargs):
        """Seul l'assigné ou le créateur du projet peut modifier"""
        tache = self.get_object()
        if request.user != tache.assigne_a and request.user != tache.projet.createur:
            return Response({"detail": "Modification non autorisée"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Seul le créateur du projet peut supprimer"""
        tache = self.get_object()
        if request.user != tache.projet.createur:
            return Response({"detail": "Suppression non autorisée"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
