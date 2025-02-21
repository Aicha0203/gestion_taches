from django.db.models import Q
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status

from projets.models import Projet
from taches.models import Tache
from .forms import CustomUserCreationForm
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

from .models import Notification
from .serializers import UtilisateurSerializer
from .forms import CustomUserChangeForm
from django.contrib import messages


Utilisateur = get_user_model()

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Seul l'utilisateur peut voir et modifier son propre profil
        return self.queryset.filter(id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        """Mise à jour complète du profil (PUT)"""
        kwargs['partial'] = False
        return self.partial_update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Mise à jour partielle du profil (PATCH)"""
        kwargs['partial'] = True
        return super().partial_update(request, *args, **kwargs)

def signup_view(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()

            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user, backend=user.backend)

            return redirect('home')
    else:
        form = CustomUserCreationForm()

    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

@login_required
def profile_view(request):
    avatar_url = request.user.avatar.url if request.user.avatar else "/static/images/default-avatar.jpg"

    return render(request, 'profile.html', {
        'user': request.user,
        'avatar_url': avatar_url,
    })

@login_required
def profile_edit(request):
    if request.method == "POST":
        form = CustomUserChangeForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profil mis à jour avec succès !")
            return redirect('profile')
    else:
        form = CustomUserChangeForm(instance=request.user)

    return render(request, 'profile_edit.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')


@login_required
def dashboard_etudiant(request):
    etudiant = request.user

    # 1. Récupération des projets pertinents
    projets = Projet.objects.filter(
        Q(createur=etudiant) | Q(taches__assigne_a=etudiant)
    ).distinct().prefetch_related('taches')

    # 2. Calcul des statistiques par projet
    for projet in projets:
        taches_projet = projet.taches.all()
        projet.total_taches = taches_projet.count()
        projet.taches_terminees = taches_projet.filter(statut='TERMINE').count()
        projet.progression = (
            (projet.taches_terminees / projet.total_taches * 100)
            if projet.total_taches > 0
            else 0
        )

    # 3. Récupération des éléments complémentaires
    taches = Tache.objects.filter(assigne_a=etudiant)
    professeurs = Utilisateur.objects.filter(role='PROFESSEUR')
    notifications = Notification.objects.filter(utilisateur=etudiant)

    # 4. Calcul des statistiques globales
    stats = {
        "termine": taches.filter(statut='TERMINE').count(),
        "encours": taches.filter(statut='EN_COURS').count(),
        "aFaire": taches.filter(statut='A_FAIRE').count(),
    }

    return render(request, 'dashboard_etudiant.html', {
        'projets': projets,
        'taches': taches,
        'professeurs': professeurs,
        'notifications': notifications,
        'stats': stats,
    })
# ✅ 🔹 **Vue Dashboard Professeur**
@login_required
def dashboard_professeur_view(request):
    return render(request, 'dashboard_professeur.html', {'user': request.user})

