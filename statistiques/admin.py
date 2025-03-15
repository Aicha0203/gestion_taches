from django.contrib import admin
from .models import Statistique

@admin.register(Statistique)
class StatistiqueAdmin(admin.ModelAdmin):
    list_display = ("utilisateur", "total_projets", "projets_en_cours", "taches_en_attente", "taches_retard", "progression_projets", "dernier_mise_a_jour")
    list_filter = ("dernier_mise_a_jour",)
    search_fields = ("utilisateur__username",)
