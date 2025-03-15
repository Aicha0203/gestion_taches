from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Statistique
from projets.models import Projet
from taches.models import Tache
from datetime import date
from django.db.models import Count


@receiver(post_save, sender=Projet)
@receiver(post_delete, sender=Projet)
def update_statistiques_projet(sender, instance, **kwargs):
    utilisateur = instance.createur
    stats, created = Statistique.objects.get_or_create(utilisateur=utilisateur)

    stats.total_projets = Projet.objects.filter(createur=utilisateur).count()
    stats.projets_en_cours = Projet.objects.filter(createur=utilisateur, statut="En cours").count()

    stats.progression_projets = round(((stats.total_projets - stats.projets_en_cours) / stats.total_projets) * 100,
                                      2) if stats.total_projets > 0 else 0
    stats.save()


@receiver(post_save, sender=Tache)
@receiver(post_delete, sender=Tache)
def update_statistiques_tache(sender, instance, **kwargs):
    utilisateur = instance.assigne_a
    if not utilisateur:
        return

    stats, created = Statistique.objects.get_or_create(utilisateur=utilisateur)

    stats.taches_en_attente = Tache.objects.filter(assigne_a=utilisateur, statut="A_FAIRE").count()
    stats.taches_retard = Tache.objects.filter(assigne_a=utilisateur, statut="A_FAIRE",
                                               date_limite__lt=date.today()).count()

    # Evolution des tâches terminées par mois
    evolution_taches = (
        Tache.objects.filter(assigne_a=utilisateur, statut="TERMINE")
        .extra(select={"month": "EXTRACT(month FROM date_limite)"})
        .values("month")
        .annotate(count=Count("id"))
    )
    stats.evolution_taches = {str(item["month"]): item["count"] for item in evolution_taches}

    stats.save()
