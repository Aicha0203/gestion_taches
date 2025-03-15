from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TacheViewSet, get_taches_par_projet, mes_taches_assignees, suivi_taches_projet

router = DefaultRouter()
router.register(r'taches', TacheViewSet, basename='tache')

urlpatterns = [
    path('', include(router.urls)),
    path('projet/<int:projet_id>/', get_taches_par_projet, name="get_taches_par_projet"),
    path('<int:pk>/', TacheViewSet.as_view({'get': 'retrieve'}), name="get_tache"),
    path('<int:pk>/update/', TacheViewSet.as_view({'patch': 'partial_update'}), name="update_tache"),
    path('<int:pk>/delete/', TacheViewSet.as_view({'delete': 'destroy'}), name="delete_tache"),
    path('create/', TacheViewSet.as_view({'post': 'create'}), name="create_tache"),
    path("mes-taches/", mes_taches_assignees, name="mes-taches-assignees"),
    path("suivi-taches-projet/", suivi_taches_projet, name="suivi-taches-projet"),
]
