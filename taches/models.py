from django.db import models
from utilisateurs.models import Utilisateur
from projets.models import Projet

class Tache(models.Model):
    STATUT_CHOICES = [
        ('A_FAIRE', 'À faire'),
        ('EN_COURS', 'En cours'),
        ('TERMINE', 'Terminé'),
    ]

    titre = models.CharField(max_length=200)
    description = models.TextField()
    date_limite = models.DateField(null=True, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='A_FAIRE')
    projet = models.ForeignKey(Projet, related_name='taches', on_delete=models.CASCADE)
    assigne_a = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.titre
