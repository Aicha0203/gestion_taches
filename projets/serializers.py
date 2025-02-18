from rest_framework import serializers
from .models import Projet

class ProjetSerializer(serializers.ModelSerializer):
    createur = serializers.ReadOnlyField(source='createur.username')

    class Meta:
        model = Projet
        fields = ['id', 'titre', 'description', 'createur', 'date_creation']
