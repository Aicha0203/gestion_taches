from django.db import models
from django.contrib.auth import get_user_model

Utilisateur = get_user_model()

class Message(models.Model):
    sender = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name="messages_envoyes")
    receiver = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name="messages_recus")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver} : {self.content[:30]}"
