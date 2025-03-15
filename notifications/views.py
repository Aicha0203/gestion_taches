from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtenir_notifications(request):
    notifications = Notification.objects.filter(utilisateur=request.user).order_by('-date_creation')  # ✅ Supprime le filtre lu=False pour afficher toutes les notifications
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marquer_notifications_comme_lues(request):
    Notification.objects.filter(utilisateur=request.user, lu=False).update(lu=True)
    return Response({"message": "Toutes les notifications ont été marquées comme lues."})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def marquer_une_notification_comme_lue(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, utilisateur=request.user)
        notification.lu = True
        notification.save()
        return Response({"message": "Notification marquée comme lue."})
    except Notification.DoesNotExist:
        return Response({"error": "Notification non trouvée."}, status=404)
