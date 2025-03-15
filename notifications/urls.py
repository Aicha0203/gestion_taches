from django.urls import path
from .views import obtenir_notifications, marquer_notifications_comme_lues, marquer_une_notification_comme_lue

urlpatterns = [
    path('notifications/', obtenir_notifications, name="obtenir_notifications"),
    path('notifications/lire/', marquer_notifications_comme_lues, name="marquer_notifications_comme_lues"),
    path('notifications/<int:notification_id>/lire/', marquer_une_notification_comme_lue, name="marquer_une_notification_comme_lue"),
]
