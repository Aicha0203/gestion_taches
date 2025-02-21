from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from taches.models import Tache
from .models import Projet
from .serializers import ProjetSerializer
from taches.permissions import IsCreatorOrReadOnly
from .forms import ProjetForm
from utilisateurs.forms import CustomUserChangeForm


# Vue API REST
class ProjetViewSet(viewsets.ModelViewSet):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreatorOrReadOnly]

    def get_queryset(self):
        return Projet.objects.filter(createur=self.request.user)

    def perform_create(self, serializer):
        serializer.save(createur=self.request.user)

    def update(self, request, *args, **kwargs):
        projet = self.get_object()
        if projet.createur != request.user:
            return Response({"detail": "Modification non autorisée"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        projet = self.get_object()
        if projet.createur != request.user:
            return Response({"detail": "Suppression non autorisée"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


# Vues classiques
@login_required
def project_create(request):
    if request.method == "POST":
        form = ProjetForm(request.POST)
        if form.is_valid():
            projet = form.save(commit=False)
            projet.createur = request.user
            projet.save()

            # Création des tâches
            task_titles = request.POST.getlist('task_titles[]')
            task_dates = request.POST.getlist('task_dates[]')

            for title, date_str in zip(task_titles, task_dates):
                if title.strip() and date_str:
                    Tache.objects.create(
                        projet=projet,
                        titre=title,
                        date_limite=date_str,
                        assigne_a=request.user
                    )

            messages.success(request, "Projet créé avec succès ✅")
            return redirect('projets:project_detail', pk=projet.pk)
        else:
            messages.error(request, f"Erreur lors de la création du projet ❌ {form.errors}")
    else:
        form = ProjetForm()
    return render(request, 'project_create.html', {'form': form})


@login_required
def project_detail(request, pk):
    projet = get_object_or_404(
        Projet.objects.prefetch_related('taches'),
        pk=pk,
        createur=request.user
    )
    return render(request, 'project_detail.html', {'projet': projet})


@login_required
def project_update(request, pk):
    projet = get_object_or_404(Projet, pk=pk, createur=request.user)

    if request.method == "POST":
        form = ProjetForm(request.POST, instance=projet)
        if form.is_valid():
            form.save()
            messages.success(request, "Projet mis à jour avec succès !")
            return redirect('projets:project_detail', pk=projet.pk)
        else:
            messages.error(request, "Erreur lors de la mise à jour du projet.")
    else:
        form = ProjetForm(instance=projet)

    return render(request, 'project_update.html', {'form': form})


@login_required
def project_delete(request, pk):
    projet = get_object_or_404(Projet, pk=pk, createur=request.user)

    if request.method == "POST":
        projet.delete()
        messages.success(request, "Projet supprimé avec succès !")
        return redirect('dashboard_etudiant' if request.user.role.upper() == 'ETUDIANT' else 'dashboard_professeur')

    return render(request, 'project_delete.html', {'projet': projet})


# ✅ Gestion du Profil Utilisateur
@login_required
def profile_view(request):
    if request.method == "POST":
        form = CustomUserChangeForm(request.POST, request.FILES, instance=request.user)
        password_form = PasswordChangeForm(request.user, request.POST)

        if form.is_valid():
            form.save()
            messages.success(request, "Votre profil a été mis à jour avec succès !")
            return redirect('profile')

        if password_form.is_valid():
            password_form.save()
            messages.success(request, "Mot de passe modifié avec succès !")
            return redirect('profile')

    else:
        form = CustomUserChangeForm(instance=request.user)
        password_form = PasswordChangeForm(request.user)

    return render(request, 'profile.html', {
        'form': form,
        'password_form': password_form,
    })

@login_required
def project_detail(request, pk):
    projet = get_object_or_404(Projet, pk=pk, createur=request.user)
    return render(request, 'project_detail.html', {'projet': projet})