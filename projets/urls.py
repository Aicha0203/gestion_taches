from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjetViewSet

router = DefaultRouter()
router.register(r'projects', ProjetViewSet, basename='project')

urlpatterns = [
    path('', include(router.urls)),
]
