from django.contrib import admin
from .models import Utilisateur

@admin.register(Utilisateur)
class UtilisateurAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')
    list_filter = ('role', 'is_active')
