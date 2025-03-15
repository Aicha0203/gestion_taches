from django.contrib.auth.models import AbstractUser
from django.db import models


class Utilisateur(AbstractUser):
    ROLE_CHOICES = [
        ('ETUDIANT', 'Étudiant'),
        ('PROFESSEUR', 'Professeur'),
        ('ADMIN', 'Administrateur'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    email = models.EmailField(unique=True)

    recevoir_email = models.BooleanField(default=True)
    heure_notification = models.TimeField(default="08:00")
    types_notifications = models.JSONField(default=dict)

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
