from django.contrib import admin
from .views import home_view
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),

    # JWT Authentication Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Application Endpoints
    path('utilisateurs/', include('utilisateurs.urls')),
    path('', home_view, name='home'),
    path('projets/', include('projets.urls', namespace='projets')),
    path('taches/', include('taches.urls')),
]
