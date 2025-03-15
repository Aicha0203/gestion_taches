import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from projets.models import Projet
from taches.models import Tache

Utilisateur = get_user_model()

@pytest.mark.django_db
def test_creer_tache():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet Test", description="Description Test", createur=user)

    tache_data = {
        "titre": "Tâche Test",
        "description": "Description de la tâche",
        "date_limite": "2025-06-10",
        "projet": projet.id
    }

    url = reverse("create_tache")
    response = client.post(url, tache_data, format="json")

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 201, "La tâche n'a pas été créée avec succès"
    assert response.data["titre"] == "Tâche Test", "Le titre de la tâche ne correspond pas"

@pytest.mark.django_db
def test_get_taches_projet():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet Test", description="Description Test", createur=user)
    Tache.objects.create(titre="Tâche 1", projet=projet, assigne_a=user, statut="A_FAIRE")
    Tache.objects.create(titre="Tâche 2", projet=projet, assigne_a=user, statut="EN_COURS")

    url = reverse("get_taches_par_projet", kwargs={"projet_id": projet.id})
    response = client.get(url)

    print(f"📡 Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les tâches du projet"
    assert len(response.data) == 2, "Nombre de tâches incorrect"

@pytest.mark.django_db
def test_update_tache():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet Test", description="Description Test", createur=user)
    tache = Tache.objects.create(titre="Ancienne Tâche", projet=projet, assigne_a=user)

    url = reverse("update_tache", kwargs={"pk": tache.id})
    response = client.patch(url, {"titre": "Nouvelle Tâche"}, format="json")

    print(f"📡 Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de modifier la tâche"
    assert response.data["titre"] == "Nouvelle Tâche", "Le titre de la tâche n'a pas été mis à jour"

@pytest.mark.django_db
def test_delete_tache():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet Test", description="Description Test", createur=user)
    tache = Tache.objects.create(titre="Tâche à supprimer", projet=projet, assigne_a=user)

    url = reverse("delete_tache", kwargs={"pk": tache.id})
    response = client.delete(url)

    print(f"📡 Réponse API : {response.status_code}")

    assert response.status_code == 204, "Impossible de supprimer la tâche"
    assert not Tache.objects.filter(id=tache.id).exists(), "La tâche existe toujours après suppression"

@pytest.mark.django_db
def test_mes_taches_assignees():
    client = APIClient()

    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet Test", description="Description Test", createur=user)
    Tache.objects.create(titre="Tâche Assignée", projet=projet, assigne_a=user)

    url = reverse("mes-taches-assignees")
    response = client.get(url)

    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les tâches assignées"
    assert len(response.data) == 1, "Le nombre de tâches assignées est incorrect"
