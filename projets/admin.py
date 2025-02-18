from django.contrib import admin
from .models import Projet

@admin.register(Projet)
class ProjetAdmin(admin.ModelAdmin):
    list_display = ('titre', 'description', 'createur', 'date_creation')  # Ajout de 'description'
    search_fields = ('titre',)
    list_filter = ('date_creation',)
