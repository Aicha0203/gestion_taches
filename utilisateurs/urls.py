from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UtilisateurViewSet, signup_view, login_view, logout_view,
    profile_view, profile_edit,
    dashboard_etudiant, dashboard_professeur_view
)

router = DefaultRouter()
router.register(r'users', UtilisateurViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),

    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    path('profile/', profile_view, name='profile'),
    path('profile/edit/', profile_edit, name='profile_edit'),

    path('dashboard/etudiant/', dashboard_etudiant, name="dashboard_etudiant"),
    path('dashboard/professeur/', dashboard_professeur_view, name="dashboard_professeur"),
]
