from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Projet
from .serializers import ProjetSerializer
from taches.permissions import IsCreatorOrReadOnly

class ProjetViewSet(viewsets.ModelViewSet):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreatorOrReadOnly]

    def get_queryset(self):
        return Projet.objects.filter(createur=self.request.user)


    def perform_create(self, serializer):
        """L'utilisateur connecté devient automatiquement créateur"""
        serializer.save(createur=self.request.user)

    def update(self, request, *args, **kwargs):
        projet = self.get_object()
        if projet.createur != request.user:
            return Response({"detail": "Modification non autorisée"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        projet = self.get_object()
        if projet.createur != request.user:
            return Response({"detail": "Suppression non autorisée"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
