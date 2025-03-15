import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from notifications.models import Notification

Utilisateur = get_user_model()


@pytest.mark.django_db
def test_obtenir_notifications():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    Notification.objects.create(utilisateur=user, message="Notification 1", lu=False)
    Notification.objects.create(utilisateur=user, message="Notification 2", lu=True)

    url = reverse("obtenir_notifications")
    response = client.get(url)

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les notifications"
    assert len(response.data) == 2, "Le nombre de notifications est incorrect"


@pytest.mark.django_db
def test_marquer_notifications_comme_lues():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    Notification.objects.create(utilisateur=user, message="Notification 1", lu=False)
    Notification.objects.create(utilisateur=user, message="Notification 2", lu=False)

    url = reverse("marquer_notifications_comme_lues")
    response = client.post(url)

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de marquer toutes les notifications comme lues"
    assert Notification.objects.filter(utilisateur=user, lu=False).count() == 0, "Certaines notifications ne sont pas marquées comme lues"


@pytest.mark.django_db
def test_marquer_une_notification_comme_lue():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    notification = Notification.objects.create(utilisateur=user, message="Notification à lire", lu=False)

    url = reverse("marquer_une_notification_comme_lue", kwargs={"notification_id": notification.id})
    response = client.post(url)

    print(f"Réponse API : {response.status_code} - {response.json()}")

    notification.refresh_from_db()
    assert response.status_code == 200, "Impossible de marquer la notification comme lue"
    assert notification.lu is True, "La notification n'a pas été marquée comme lue"
