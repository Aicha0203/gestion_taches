from django.db import models
from datetime import datetime
from django.utils.timezone import now
from utilisateurs.models import Utilisateur
from projets.models import Projet


class Tache(models.Model):
    STATUT_CHOICES = [
        ('A_FAIRE', 'À faire'),
        ('EN_COURS', 'En cours'),
        ('TERMINE', 'Terminé'),
        ('EN_RETARD', 'En retard'),
    ]

    titre = models.CharField(max_length=200)
    description = models.TextField()
    date_limite = models.DateField(null=True, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='A_FAIRE')
    projet = models.ForeignKey(Projet, related_name='taches', on_delete=models.CASCADE)
    assigne_a = models.ForeignKey(Utilisateur, related_name="taches_assignees", on_delete=models.SET_NULL, null=True)
    createur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name="taches_creees", null=True, blank=True)
    date_fin = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.createur:
            self.createur = self.projet.createur

        if isinstance(self.date_limite, str):
            self.date_limite = datetime.strptime(self.date_limite, "%Y-%m-%d").date()

        if self.statut == "TERMINE" and self.date_fin is None:
            self.date_fin = now()
        elif self.date_limite and now().date() > self.date_limite and self.statut != "TERMINE":
            self.statut = "EN_RETARD"

        super().save(*args, **kwargs)

        if self.assigne_a:
            self.projet.membres.add(self.assigne_a)
    def __str__(self):
        return f"{self.titre} - {self.get_statut_display()}"
