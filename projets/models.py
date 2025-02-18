from django.db import models
from utilisateurs.models import Utilisateur

class Projet(models.Model):
    titre = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    createur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='projets')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre
