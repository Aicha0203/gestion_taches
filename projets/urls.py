from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjetViewSet, project_create, project_detail,
    project_update, project_delete, get_projets_etudiant, get_activites_projet
)

app_name = 'projets'

router = DefaultRouter()
router.register(r'projets', ProjetViewSet, basename='projet')

urlpatterns = [
    path('', include(router.urls)),
    path('create/', project_create, name='project_create'),
    path('<int:pk>/', project_detail, name='project_detail'),
    path('<int:pk>/update/', project_update, name='project_update'),
    path('<int:pk>/delete/', project_delete, name='project_delete'),
    path('list/', get_projets_etudiant, name='Listprojets'),
]
urlpatterns = [path('', include(router.urls))] + urlpatterns