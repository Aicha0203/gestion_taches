from rest_framework import serializers
from projets.models import Projet 
from .models import Tache

class TacheSerializer(serializers.ModelSerializer):
    projet = serializers.PrimaryKeyRelatedField(queryset=Projet.objects.all(), required=True)  # Correction du queryset
    assigne_a = serializers.ReadOnlyField(source='assigne_a.username')

    class Meta:
        model = Tache
        fields = ['id', 'titre', 'description', 'date_limite', 'statut', 'projet', 'assigne_a']
        extra_kwargs = {
            'projet': {'required': True},
        }
