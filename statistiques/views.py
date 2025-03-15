from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils.timezone import now, timedelta
from projets.models import Projet
from taches.models import Tache
from utilisateurs.models import Utilisateur

def save(self, *args, **kwargs):
    if self.statut == "TERMINE" and not self.date_fin:
        self.date_fin = now()
    super().save(*args, **kwargs)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils.timezone import now
from projets.models import Projet
from taches.models import Tache

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_statistiques(request):
    try:
        utilisateur = request.user

        total_projets = Projet.objects.filter(createur=utilisateur).count()
        projets_en_cours = Projet.objects.filter(createur=utilisateur, statut="En cours").count()
        projets_termines = Projet.objects.filter(createur=utilisateur, statut="Terminé").count()
        projets_retard = Projet.objects.filter(createur=utilisateur, statut="En attente").count()

        total_taches = Tache.objects.filter(projet__createur=utilisateur).count()
        taches_en_attente = Tache.objects.filter(projet__createur=utilisateur, statut="En attente").count()
        taches_terminees = Tache.objects.filter(projet__createur=utilisateur, statut="TERMINE").count()
        taches_retard = Tache.objects.filter(projet__createur=utilisateur, statut="En retard").count()

        return Response({
            "total_projets": total_projets,
            "projets_en_cours": projets_en_cours,
            "projets_termines": projets_termines,
            "projets_retard": projets_retard,
            "total_taches": total_taches,
            "taches_en_attente": taches_en_attente,
            "taches_terminees": taches_terminees,
            "taches_retard": taches_retard,
        })

    except Exception as e:
        print(" Erreur dans get_statistiques :", str(e))
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def evolution_taches(request):
    utilisateur = request.user
    today = now().date()
    last_7_days = [today - timedelta(days=i) for i in range(6, -1, -1)]

    data = []
    for day in last_7_days:
        count = Tache.objects.filter(
            assigne_a=utilisateur,
            statut="TERMINE",
            date_fin__date=day
        ).count()
        data.append({"date": day.strftime("%d/%m"), "taches_terminees": count})

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def deadlines_taches(request):
    utilisateur = request.user
    taches = (
        Tache.objects.filter(assigne_a=utilisateur, date_limite__isnull=False)
        .order_by("date_limite")
    )

    data = {}
    for tache in taches:
        date_str = tache.date_limite.strftime("%Y-%m-%d")
        if date_str not in data:
            data[date_str] = []
        data[date_str].append(tache.titre)

    formatted_data = [{"date": date, "taches": taches} for date, taches in data.items()]

    return Response(formatted_data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_etudiants_les_plus_actifs(request):
    etudiants_actifs = (
        Utilisateur.objects.filter(role="ETUDIANT")
        .annotate(tasks_completed=Count("taches_assignees", filter=Q(taches_assignees__statut="TERMINE")))
        .order_by("-tasks_completed")[:10]
    )

    data = [
        {
            "nom": f"{e.first_name} {e.last_name}",
            "taches_terminees": e.tasks_completed,
            "avatar": e.avatar.url if e.avatar else None
        }
        for e in etudiants_actifs
    ]

    return Response(data)


from django.db.models import F, Q


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def evaluation_professeur(request):
    utilisateur = request.user

    print(f"Évaluation demandée pour : {utilisateur}")

    if utilisateur.role != "PROFESSEUR":
        return Response({"error": "Accès refusé. Seuls les professeurs peuvent être évalués."}, status=status.HTTP_403_FORBIDDEN)

    taches = Tache.objects.filter(assigne_a=utilisateur)
    total_taches = taches.count()

    print(f"Nombre total de tâches trouvées : {total_taches}")

    if total_taches == 0:
        return Response({"message": "Aucune tâche assignée pour l'instant."}, status=status.HTTP_200_OK)

    taches_terminees = taches.filter(statut="TERMINE").count()

    print(f"Tâches terminées : {taches_terminees}")

    taux_completion = round((taches_terminees / total_taches) * 100, 2) if total_taches > 0 else 0

    taux_delai = taux_completion

    prime = 0
    if taux_delai >= 90:
        prime = 30000
    if taux_delai == 100:
        prime = 100000


    return Response({
        "total_taches": total_taches,
        "taches_terminees": taches_terminees,
        "taux_completion": taux_completion,
        "taux_delai": taux_delai,
        "prime": prime,
    }, status=status.HTTP_200_OK)