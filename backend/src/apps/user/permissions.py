from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class IsOwnerOrAdmin(BasePermission):
    """
    Allows access only to owner or admin users.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        user_id = view.kwargs.get("pk", 0)
        return bool(request.user and request.user.is_staff or user_id == request.user.pk)
