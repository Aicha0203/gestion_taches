from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Tache

@receiver(post_save, sender=Tache)
@receiver(post_delete, sender=Tache)
def update_project_progress(sender, instance, **kwargs):
    projet = instance.projet
    if projet:
        projet.mettre_a_jour_progression()
