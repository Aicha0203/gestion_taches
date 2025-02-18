from rest_framework import permissions

class IsCreatorOrReadOnly(permissions.BasePermission):
    """Seul le créateur peut modifier ou supprimer, les autres peuvent lire"""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.createur == request.user

class IsAssigneeOrCreator(permissions.BasePermission):
    """Seul l’assigné ou le créateur du projet peut modifier la tâche"""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.assigne_a == request.user or obj.projet.createur == request.user
