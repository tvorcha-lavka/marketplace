from rest_framework.permissions import BasePermission


class IsAnonymousOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return True
        return request.user.is_staff
