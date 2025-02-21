from django import forms
from .models import Projet

class ProjetForm(forms.ModelForm):
    class Meta:
        model = Projet
        fields = [
            'titre', 'description', 'statut',
            'date_limite', 'rappel', 'heure_rappel', 'emoji'
        ]
        widgets = {
            'date_limite': forms.DateInput(attrs={'type': 'date'}),
            'heure_rappel': forms.TimeInput(attrs={'type': 'time'}),
        }

    def clean_date_limite(self):
        date_limite = self.cleaned_data.get('date_limite')
        if not date_limite:
            raise forms.ValidationError("La date limite est obligatoire.")
        return date_limite