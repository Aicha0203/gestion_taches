import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from projets.models import Projet
from taches.models import Tache

Utilisateur = get_user_model()


@pytest.mark.django_db
def test_creer_projet():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet_data = {
        "titre": "Projet Test",
        "description": "Description du projet",
    }

    url = reverse("project_create")
    response = client.post(url, projet_data, format="json")

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 201, "Le projet n'a pas été créé avec succès"
    assert response.data["titre"] == "Projet Test", "Le titre du projet ne correspond pas"


@pytest.mark.django_db
def test_get_projets_etudiant():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    Projet.objects.create(titre="Projet 1", description="Test 1", createur=user)
    Projet.objects.create(titre="Projet 2", description="Test 2", createur=user)

    url = reverse("Listprojets")
    response = client.get(url)

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les projets de l'étudiant"
    assert len(response.data) == 2, "Nombre de projets incorrect"


@pytest.mark.django_db
def test_update_projet():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Ancien Projet", description="Description ancienne", createur=user)

    url = reverse("project_update", kwargs={"pk": projet.id})
    response = client.patch(url, {"titre": "Nouveau Projet"}, format="json")

    print(f"📡 Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de modifier le projet"
    assert response.data["titre"] == "Nouveau Projet", "Le titre du projet n'a pas été mis à jour"


@pytest.mark.django_db
def test_delete_projet():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet à supprimer", description="À supprimer", createur=user)

    url = reverse("project_delete", kwargs={"pk": projet.id})
    response = client.delete(url)

    print(f"Réponse API : {response.status_code}")

    assert response.status_code == 204, "Impossible de supprimer le projet"
    assert not Projet.objects.filter(id=projet.id).exists(), "Le projet existe toujours après suppression"


@pytest.mark.django_db
def test_get_activites_projet():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet Test", description="Activités", createur=user)

    url = reverse("get_activites_projet", kwargs={"projet_id": projet.id})
    response = client.get(url)

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les activités du projet"
    assert len(response.data) > 0, "Aucune activité retournée"
