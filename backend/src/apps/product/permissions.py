from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import Product


class IsProductOwnerOrAdmin(BasePermission):

    # TODO: Сейчас проверка работает на базовом уровне, валидирует владельца и админа.
    #  Нужно поиграться с пермишенами в методе create, если мы хотим использовать django-guardian.
    #  Но пока я не особо понимаю использование библиотеки django-guardian, возможно она будет лишняя.
    def has_object_permission(self, request: Request, view: APIView, obj: Product) -> bool:
        return request.user.is_staff or request.user == obj.owner.user
