from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from projets.models import Projet
from taches.models import Tache

@receiver(post_save, sender=Projet)
def notification_nouveau_projet(sender, instance, created, **kwargs):
    if created:
        message = f"Un nouveau projet a été créé : {instance.titre}"
        Notification.objects.create(utilisateur=instance.createur, message=message, type='project', projet=instance)

@receiver(post_save, sender=Tache)
def notification_nouvelle_tache(sender, instance, created, **kwargs):
    if created and instance.assigne_a:
        message = f"Une nouvelle tâche vous a été assignée : {instance.titre}"
        Notification.objects.create(utilisateur=instance.assigne_a, message=message, type='task', tache=instance)
