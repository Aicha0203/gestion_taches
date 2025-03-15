from django.urls import path
from .views import get_statistiques, evolution_taches, deadlines_taches, get_etudiants_les_plus_actifs, evaluation_professeur

urlpatterns = [
    path('stats/', get_statistiques, name="get_statistiques"),
    path('stats/evolution-taches/', evolution_taches, name="evolution_taches"),
    path("stats/deadlines/", deadlines_taches, name="deadlines_taches"),
    path("stats/etudiants-actifs/", get_etudiants_les_plus_actifs, name="get_etudiants_les_plus_actifs"),
    path("stats/evaluation-professeur/", evaluation_professeur, name="evaluation_professeur"),
]
