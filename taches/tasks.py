from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from .models import Tache

@shared_task
def notifier_taches_imminentes():
    """ Vérifie les tâches imminentes et envoie un email aux utilisateurs concernés """
    maintenant = timezone.now()
    limite = maintenant + timedelta(days=2)

    taches = Tache.objects.filter(date_limite__lte=limite, date_limite__gte=maintenant)

    emails_envoyes = 0

    for tache in taches:
        if tache.assigne_a and tache.assigne_a.email:
            try:
                send_mail(
                    subject=f"📌 Rappel : La tâche '{tache.titre}' approche de sa date limite",
                    message=f"""
                        Bonjour {tache.assigne_a.username},

                        ⏳ La tâche **'{tache.titre}'** est prévue pour le **{tache.date_limite}**. 
                        📌 Veuillez la compléter à temps pour éviter les retards.

                        ✅ Cordialement,
                        L'équipe de Gestion des Tâches
                    """,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[tache.assigne_a.email],
                    fail_silently=False,
                )
                emails_envoyes += 1
            except Exception as e:
                print(f"❌ Erreur d'envoi à {tache.assigne_a.email} : {e}")

    return f"{emails_envoyes} notifications envoyées."
