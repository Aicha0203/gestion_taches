from django.contrib import admin
from .models import Projet

@admin.register(Projet)
class ProjetAdmin(admin.ModelAdmin):
    list_display = ('titre', 'description', 'statut', 'date_limite', 'createur', 'date_creation')
    search_fields = ('titre',)
    list_filter = ('statut', 'date_limite')
