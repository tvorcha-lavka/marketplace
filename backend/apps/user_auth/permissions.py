from rest_framework.permissions import BasePermission


class IsAnonymousOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.is_staff or request.user.is_anonymous)
