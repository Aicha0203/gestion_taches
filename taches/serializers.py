from rest_framework import serializers
from utilisateurs.models import Utilisateur
from projets.models import Projet
from .models import Tache

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ["id", "username", "first_name", "last_name"]

class ProjetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projet
        fields = ["id", "titre", "description", "statut"]

class TacheSerializer(serializers.ModelSerializer):
    projet = ProjetSerializer(read_only=True)
    assigne_a = UtilisateurSerializer(read_only=True)

    class Meta:
        model = Tache
        fields = "__all__"
