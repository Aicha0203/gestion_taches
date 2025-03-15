from django.contrib import admin
from .models import Notification

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'message', 'type', 'lu', 'date_creation')
    list_filter = ('type', 'lu', 'date_creation')
    search_fields = ('utilisateur__username', 'message')

admin.site.register(Notification, NotificationAdmin)
