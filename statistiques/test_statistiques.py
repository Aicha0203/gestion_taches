import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from taches.models import Tache
from projets.models import Projet
from django.utils.timezone import now, timedelta

Utilisateur = get_user_model()


@pytest.mark.django_db
def test_get_statistiques():
    client = APIClient()
    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    Projet.objects.create(titre="Projet Test", description="Description Test", createur=user)
    url = reverse("get_statistiques")

    response = client.get(url)
    print(f"📡 Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les statistiques"
    assert "total_projets" in response.data, "Les statistiques des projets ne sont pas présentes"


@pytest.mark.django_db
def test_evolution_taches():
    client = APIClient()
    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet Test", description="Description Test", createur=user)
    for i in range(3):
        Tache.objects.create(
            titre=f"Tâche {i+1}",
            projet=projet,
            assigne_a=user,
            statut="TERMINE",
            date_fin=now() - timedelta(days=i)
        )

    url = reverse("evolution_taches")
    response = client.get(url)
    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer l'évolution des tâches"
    assert isinstance(response.data, list), "Les données doivent être une liste"


@pytest.mark.django_db
def test_deadlines_taches():
    client = APIClient()
    user = Utilisateur.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
    client.force_authenticate(user=user)

    projet = Projet.objects.create(titre="Projet Test", description="Description Test", createur=user)
    Tache.objects.create(
        titre="Tâche avec deadline",
        projet=projet,
        assigne_a=user,
        date_limite=now() + timedelta(days=5)
    )

    url = reverse("deadlines_taches")
    response = client.get(url)
    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les deadlines des tâches"
    assert isinstance(response.data, list), "Les données doivent être une liste"
    assert len(response.data) > 0, "Il doit y avoir au moins une tâche avec une deadline"


@pytest.mark.django_db
def test_get_etudiants_les_plus_actifs():
    client = APIClient()
    etudiant1 = Utilisateur.objects.create_user(username="etudiant1", email="etu1@example.com", password="testpass123", role="ETUDIANT")
    etudiant2 = Utilisateur.objects.create_user(username="etudiant2", email="etu2@example.com", password="testpass123", role="ETUDIANT")

    projet = Projet.objects.create(titre="Projet Test", description="Description Test", createur=etudiant1)
    for i in range(5):
        Tache.objects.create(titre=f"Tâche {i+1}", projet=projet, assigne_a=etudiant1, statut="TERMINE")

    client.force_authenticate(user=etudiant1)

    url = reverse("get_etudiants_les_plus_actifs")
    response = client.get(url)
    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer les étudiants actifs"
    assert len(response.data) > 0, "Il doit y avoir au moins un étudiant actif"


@pytest.mark.django_db
def test_evaluation_professeur():
    client = APIClient()
    professeur = Utilisateur.objects.create_user(username="professeur", email="prof@example.com", password="testpass123", role="PROFESSEUR")
    client.force_authenticate(user=professeur)

    projet = Projet.objects.create(titre="Projet Prof", description="Projet test", createur=professeur)
    for i in range(10):
        Tache.objects.create(titre=f"Tâche {i+1}", projet=projet, assigne_a=professeur, statut="TERMINE")

    url = reverse("evaluation_professeur")
    response = client.get(url)
    print(f"Réponse API : {response.status_code} - {response.json()}")

    assert response.status_code == 200, "Impossible de récupérer l'évaluation du professeur"
    assert "taux_completion" in response.data, "Le taux de complétion doit être inclus"
