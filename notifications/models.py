from django.db import models
from utilisateurs.models import Utilisateur
from projets.models import Projet
from taches.models import Tache

class Notification(models.Model):
    TYPE_CHOICES = [
        ('task', 'Tâche'),
        ('project', 'Projet'),
        ('other', 'Autre'),
    ]

    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name="notifications_utilisateur")
    message = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default="other")
    lu = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)

    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, null=True, blank=True, related_name="notifications_projet")
    tache = models.ForeignKey(Tache, on_delete=models.CASCADE, null=True, blank=True, related_name="notifications_tache")

    def __str__(self):
        return f"Notification {self.utilisateur.username} - {self.message[:30]}"
