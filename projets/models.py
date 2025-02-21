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
        choices=[('aucun', 'Aucun'), ('matin', 'Matin (09:00)'), ('midi', 'Midi (12:00)'),
                 ('apresmidi', 'Après-midi (16:00)'), ('soir', 'Soir (19:00)'), ('custom', 'Personnalisé')],
        default='aucun'
    )
    heure_rappel = models.TimeField(null=True, blank=True)
    emoji = models.CharField(max_length=10, default="🚀")
    createur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name="projets")
    date_creation = models.DateTimeField(auto_now_add=True)  # ✅ Ajout du champ date_creation

    def __str__(self):
        return self.titre
