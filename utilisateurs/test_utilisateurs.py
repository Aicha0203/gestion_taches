import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model

Utilisateur = get_user_model()


@pytest.mark.django_db
def test_login_user():
    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123",
                                           role="ETUDIANT")

    client = APIClient()
    url = reverse("token_obtain_pair")

    response = client.post(url, {"email": user.email, "password": "testpass123"}, format="json")

    assert response.status_code == 200
    assert "access" in response.data


@pytest.mark.django_db
def test_get_user_profile():
    """👤 Test de récupération du profil utilisateur"""
    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123",
                                           role="ETUDIANT")

    client = APIClient()
    client.force_authenticate(user=user)

    url = reverse("utilisateur-me")
    response = client.get(url)

    assert response.status_code == 200
    assert response.data["username"] == "testuser"


@pytest.mark.django_db
def test_reset_password():
    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123",
                                           role="ETUDIANT")

    client = APIClient()
    url = reverse("reset_password")

    response = client.post(url, {"email": user.email, "new_password": "newpass123", "confirm_password": "newpass123"},
                           format="json")

    assert response.status_code == 200
    assert response.data["message"] == "Mot de passe réinitialisé avec succès"

    user.refresh_from_db()
    assert user.check_password("newpass123") is True
