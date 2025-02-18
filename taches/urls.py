from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TacheViewSet

router = DefaultRouter()
router.register(r'', TacheViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]
