from django.contrib import admin
from .models import Message

class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "sender", "receiver", "content", "timestamp")
    search_fields = ("sender__username", "receiver__username", "content")
    list_filter = ("timestamp",)
    ordering = ("-timestamp",)

admin.site.register(Message, MessageAdmin)
