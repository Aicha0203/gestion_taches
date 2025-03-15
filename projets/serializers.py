from rest_framework import serializers
from .models import Projet
from taches.models import Tache

class TacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tache
        fields = '__all__'

class ProjetSerializer(serializers.ModelSerializer):
    createur = serializers.ReadOnlyField(source='createur.username')
    taches = TacheSerializer(many=True, read_only=True)
    progression = serializers.SerializerMethodField()

    class Meta:
        model = Projet
        fields = ['id', 'titre', 'description', 'createur', 'date_creation', 'taches', 'progression']

    def get_progression(self, obj):
        total_taches = obj.taches.count()
        taches_terminees = obj.taches.filter(statut="TERMINE").count()
        return (taches_terminees / total_taches) * 100 if total_taches > 0 else 0
