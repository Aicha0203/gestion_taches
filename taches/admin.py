from django.contrib import admin
from .models import Tache

@admin.register(Tache)
class TacheAdmin(admin.ModelAdmin):
    list_display = ('titre', 'description', 'projet', 'statut', 'assigne_a', 'date_limite')  # Ajout de 'description' et 'date_limite'
    search_fields = ('titre',)
    list_filter = ('statut', 'date_limite', 'projet')
