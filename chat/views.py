from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.db import models
from .models import Message
from .serializers import MessageSerializer

Utilisateur = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, receiver_username):
    sender = request.user

    try:
        receiver = Utilisateur.objects.get(username=receiver_username)
    except Utilisateur.DoesNotExist:
        return Response({"error": "Utilisateur non trouvé"}, status=404)

    messages = Message.objects.filter(
        Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)
    ).order_by("timestamp")

    return Response(MessageSerializer(messages, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request):
    sender = request.user
    receiver_username = request.data.get("receiver")
    content = request.data.get("content")

    if not receiver_username or not content:
        return Response({"error": "Données invalides"}, status=400)

    try:
        receiver = Utilisateur.objects.get(username=receiver_username)
    except Utilisateur.DoesNotExist:
        return Response({"error": "Utilisateur non trouvé"}, status=404)

    message = Message.objects.create(sender=sender, receiver=receiver, content=content)

    return Response(MessageSerializer(message).data, status=201)
