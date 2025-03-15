from django.urls import re_path
from .consumers import NotificationConsumer, ActivityConsumer, TacheConsumer

websocket_urlpatterns = [
    re_path(r"ws/notifications/$", NotificationConsumer.as_asgi()),
    re_path(r"ws/taches/(?P<projet_id>\d+)/$", TacheConsumer.as_asgi()),
    re_path(r"ws/activites/(?P<projet_id>\d+)/$", ActivityConsumer.as_asgi()),
]
