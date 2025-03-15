from django.contrib import admin
from .models import Tache

@admin.register(Tache)
class TacheAdmin(admin.ModelAdmin):
    list_display = ("titre", "statut", "date_limite", "projet", "assigne_a")
    list_filter = ("statut", "date_limite", "projet")
    search_fields = ("titre", "description", "projet__titre")
