from django.urls import path
from .views import send_message, get_messages

urlpatterns = [
    path("messages/send/", send_message, name="send_message"),
    path("messages/<str:receiver_username>/", get_messages, name="get_messages"),
]
