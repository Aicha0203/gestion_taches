from django.db import models
from django.contrib.auth import get_user_model
from projets.models import Projet
from taches.models import Tache
from django.utils.timezone import now

Utilisateur = get_user_model()


class Statistique(models.Model):
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name="statistiques")
    total_projets = models.IntegerField(default=0)
    projets_en_cours = models.IntegerField(default=0)
    taches_en_attente = models.IntegerField(default=0)
    taches_retard = models.IntegerField(default=0)
    progression_projets = models.FloatField(default=0.0)
    dernier_mise_a_jour = models.DateTimeField(auto_now=True)

    def mettre_a_jour_statistiques(self):
        self.total_projets = Projet.objects.filter(createur=self.utilisateur).count()
        self.projets_en_cours = Projet.objects.filter(createur=self.utilisateur, statut="En cours").count()
        self.taches_en_attente = Tache.objects.filter(assigne_a=self.utilisateur, statut="A_FAIRE").count()
        self.taches_retard = Tache.objects.filter(
            assigne_a=self.utilisateur, statut="A_FAIRE", date_limite__lt=now()
        ).count()

        total_taches = Tache.objects.filter(projet__createur=self.utilisateur).count()
        taches_terminees = Tache.objects.filter(projet__createur=self.utilisateur, statut="TERMINE").count()
        self.progression_projets = (taches_terminees / total_taches) * 100 if total_taches > 0 else 0

        self.save()

    def __str__(self):
        return f"Statistiques de {self.utilisateur.username}"
