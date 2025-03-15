import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from chat.models import Message

Utilisateur = get_user_model()


@pytest.mark.django_db
def test_send_message():
    client = APIClient()

    sender = Utilisateur.objects.create_user(username="sender", email="sender@example.com", password="testpass123")
    receiver = Utilisateur.objects.create_user(username="receiver", email="receiver@example.com", password="testpass123")

    client.force_authenticate(user=sender)

    message_data = {
        "receiver": receiver.username,
        "content": "Bonjour, comment ça va ?"
    }

    url = reverse("send_message")
    response = client.post(url, message_data, format="json")

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 201, "Le message n'a pas été envoyé avec succès"
    assert response.data["content"] == "Bonjour, comment ça va ?", "Le contenu du message ne correspond pas"


@pytest.mark.django_db
def test_get_messages():
    client = APIClient()

    sender = Utilisateur.objects.create_user(username="sender", email="sender@example.com", password="testpass123")
    receiver = Utilisateur.objects.create_user(username="receiver", email="receiver@example.com", password="testpass123")

    client.force_authenticate(user=sender)

    Message.objects.create(sender=sender, receiver=receiver, content="Premier message")
    Message.objects.create(sender=receiver, receiver=sender, content="Réponse au message")

    url = reverse("get_messages", kwargs={"receiver_username": receiver.username})
    response = client.get(url)

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les messages"
    assert len(response.data) == 2, "Nombre de messages incorrect"
    assert response.data[0]["content"] == "Premier message", "Le premier message ne correspond pas"
    assert response.data[1]["content"] == "Réponse au message", "Le second message ne correspond pas"


@pytest.mark.django_db
def test_get_messages_user_not_found():
    client = APIClient()

    sender = Utilisateur.objects.create_user(username="sender", email="sender@example.com", password="testpass123")
    client.force_authenticate(user=sender)

    url = reverse("get_messages", kwargs={"receiver_username": "unknown_user"})
    response = client.get(url)

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 404, "L'API aurait dû renvoyer une erreur 404 pour l'utilisateur inexistant"


@pytest.mark.django_db
def test_send_message_user_not_found():
    client = APIClient()

    sender = Utilisateur.objects.create_user(username="sender", email="sender@example.com", password="testpass123")
    client.force_authenticate(user=sender)

    message_data = {
        "receiver": "unknown_user",
        "content": "Ceci est un message test"
    }

    url = reverse("send_message")
    response = client.post(url, message_data, format="json")

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 404, "L'API aurait dû renvoyer une erreur 404 pour l'utilisateur inexistant"
