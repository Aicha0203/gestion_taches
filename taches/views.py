from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Tache
from .serializers import TacheSerializer
from projets.models import Projet, Utilisateur
from taches.permissions import IsAssigneeOrCreator


class TacheViewSet(viewsets.ModelViewSet):
    queryset = Tache.objects.all()
    serializer_class = TacheSerializer
    permission_classes = [permissions.IsAuthenticated, IsAssigneeOrCreator]

    def get_queryset(self):

        projet_id = self.request.query_params.get('projet', None)
        user = self.request.user

        if not user.is_authenticated:
            return Tache.objects.none()

        if projet_id:
            return Tache.objects.filter(
                projet__id=projet_id
            ).filter(
                projet__createur=user
            ) | Tache.objects.filter(assigne_a=user)

        return Tache.objects.filter(projet__createur=user) | Tache.objects.filter(assigne_a=user)

    def create(self, request, *args, **kwargs):

        projet_id = request.data.get("projet")
        if not projet_id:
            print("ERREUR: Aucun projet ID reçu !")
            return Response({"detail": "Un ID de projet est requis."}, status=status.HTTP_400_BAD_REQUEST)

        projet = get_object_or_404(Projet, id=projet_id)

        if projet.createur != request.user:
            print("Tentative de création par un utilisateur non autorisé")
            return Response(
                {"detail": "Vous ne pouvez créer des tâches que pour vos propres projets."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Erreur de validation :", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        assigne_a_id = request.data.get("assigne_a")
        assigne_a = Utilisateur.objects.filter(id=assigne_a_id).first() if assigne_a_id else None

        tache = serializer.save(projet=projet, assigne_a=assigne_a)
        if tache.assigne_a:
            projet.membres.add(tache.assigne_a)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):

        tache = self.get_object()
        if request.user != tache.assigne_a and request.user != tache.projet.createur:
            return Response({"detail": "Modification non autorisée"}, status=status.HTTP_403_FORBIDDEN)

        response = super().update(request, *args, **kwargs)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"taches_{tache.projet.id}",
            {"type": "update_tache", "message": TacheSerializer(tache).data}
        )
        return response

    def destroy(self, request, *args, **kwargs):

        tache = self.get_object()
        projet_id = tache.projet.id

        if request.user != tache.projet.createur:
            return Response({"detail": "Suppression non autorisée"}, status=status.HTTP_403_FORBIDDEN)

        response = super().destroy(request, *args, **kwargs)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"taches_{projet_id}",
            {"type": "update_tache", "message": {"id": tache.id, "deleted": True}}
        )

        return response

    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()
        task.titre = request.data.get("titre", task.titre)
        task.description = request.data.get("description", task.description)
        task.date_limite = request.data.get("date_limite", task.date_limite)
        assigne_a_id = request.data.get("assigne_a")
        if assigne_a_id:
            task.assigne_a = Utilisateur.objects.filter(id=assigne_a_id).first()
        task.statut = request.data.get("statut", task.statut)
        task.save()

        return Response(TacheSerializer(task).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_taches_par_projet(request, projet_id):
    projet = get_object_or_404(Projet, id=projet_id, createur=request.user)
    taches = Tache.objects.filter(projet=projet)

    if not taches.exists():
        return Response({"detail": "Aucune tâche trouvée pour ce projet."}, status=status.HTTP_404_NOT_FOUND)

    serializer = TacheSerializer(taches, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mes_taches_assignees(request):
    utilisateur = request.user
    taches = Tache.objects.filter(assigne_a=utilisateur).order_by("-date_limite")
    serializer = TacheSerializer(taches, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def suivi_taches_projet(request):
    utilisateur = request.user
    taches = Tache.objects.filter(projet__createur=utilisateur).order_by("date_limite")

    data = {
        "taches_en_cours": taches.filter(statut="EN_COURS").count(),
        "taches_terminees": taches.filter(statut="TERMINE").count(),
        "taches_en_retard": taches.filter(statut="EN_RETARD").count(),
        "taches_details": TacheSerializer(taches, many=True).data
    }

    return Response(data)
