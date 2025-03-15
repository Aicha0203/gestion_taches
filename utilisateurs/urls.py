from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UtilisateurViewSet, reset_password, get_csrf_token

router = DefaultRouter()
router.register(r'', UtilisateurViewSet, basename="utilisateur")

urlpatterns = [
    path("me/", UtilisateurViewSet.as_view({'get': 'me', 'patch': 'me'}), name="utilisateur-me"),  # ✅ Corrigé !
    path("password-reset/", reset_password, name="reset_password"),
    path("csrf/", get_csrf_token, name="get_csrf_token"),
]

urlpatterns += router.urls
