from rest_framework.permissions import BasePermission


class IsOwnerOrAdmin(BasePermission):
    """
    Allows access only to owner or admin users.
    """

    def has_permission(self, request, view):
        user_id = view.kwargs.get("pk", 0)
        return bool(request.user and request.user.is_staff or user_id == request.user.id)
