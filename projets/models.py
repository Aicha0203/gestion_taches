from datetime import datetime, date
from django.db import models
from django.contrib.auth import get_user_model

Utilisateur = get_user_model()

class Projet(models.Model):
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="Aucune description")
    statut = models.CharField(
        max_length=50,
        choices=[('En cours', 'En cours'), ('Terminé', 'Terminé'), ('En attente', 'En attente')],
        default='En cours'
    )
    date_limite = models.DateField(null=True, blank=True)
    rappel = models.CharField(
        max_length=20,
        choices=[
            ('aucun', 'Aucun'), ('matin', 'Matin (09:00)'), ('midi', 'Midi (12:00)'),
            ('apresmidi', 'Après-midi (16:00)'), ('soir', 'Soir (19:00)'), ('custom', 'Personnalisé')
        ],
        default='aucun'
    )
    heure_rappel = models.TimeField(null=True, blank=True)
    emoji = models.CharField(max_length=10, default="🚀")
    createur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name="projets")
    membres = models.ManyToManyField(Utilisateur, related_name="projets_membre", blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    progression = models.FloatField(default=0.0)

    def __str__(self):
        return self.titre

    def mettre_a_jour_progression(self):
        total_taches = self.taches.count()
        taches_terminees = self.taches.filter(statut="TERMINE").count()

        if total_taches > 0:
            self.progression = round((taches_terminees / total_taches) * 100, 2)
        else:
            self.progression = 0

        if total_taches > 0 and total_taches == taches_terminees:
            self.statut = "Terminé"
        elif self.date_limite and self.date_limite < date.today():
            self.statut = "En attente"
        else:
            self.statut = "En cours"

        self.save()

    def mettre_a_jour_membres(self):
        from taches.models import Tache
        utilisateurs_assignes = Utilisateur.objects.filter(taches_assignees__projet=self).distinct()
        self.membres.set(utilisateurs_assignes)
        print(f"Membres mis à jour pour le projet {self.titre} : {[u.username for u in utilisateurs_assignes]}")
