import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path('api/utilisateurs/', include('utilisateurs.urls')),
    path('api/', include('notifications.urls')),
    path('api/', include('statistiques.urls')),
    path('api/', include('projets.urls')),
    path('api/taches/', include('taches.urls')),
    path("api/chat/", include("chat.urls")),

    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}),
    re_path(r"^assets/(?P<path>.*)$", serve, {"document_root": os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'assets')}),

    re_path(r"^(?!api/|admin/|media/|static/|assets/).*", TemplateView.as_view(template_name="index.html"), name="react_app"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
