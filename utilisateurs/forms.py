from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Utilisateur

class CustomUserCreationForm(UserCreationForm):
    ROLE_CHOICES = [
        ('ETUDIANT', 'Étudiant'),
        ('PROFESSEUR', 'Professeur'),
    ]

    role = forms.ChoiceField(choices=ROLE_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}))

    class Meta:
        model = Utilisateur
        fields = ['username', 'first_name', 'last_name', 'email', 'role', 'password1', 'password2']

class CustomUserChangeForm(UserChangeForm):
    password = None  # Empêche l'affichage du champ mot de passe

    class Meta:
        model = Utilisateur
        fields = ['username', 'first_name', 'last_name', 'email', 'avatar']
