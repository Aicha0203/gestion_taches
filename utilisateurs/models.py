from django.contrib.auth.models import AbstractUser
from django.db import models

class Utilisateur(AbstractUser):
    ROLE_CHOICES = [
        ('ETUDIANT', 'Étudiant'),
        ('PROFESSEUR', 'Professeur'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # Ajoutez ces lignes pour éviter les conflits
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='utilisateur_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='utilisateur_permissions',
        blank=True
    )

    def __str__(self):
        return f"{self.username} ({self.role})"
