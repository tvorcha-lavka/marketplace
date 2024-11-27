from rest_framework.permissions import BasePermission


class IsProductOwnerOrAdmin(BasePermission):

    # TODO: Сейчас проверка работает на базовом уровне, валидирует владельца и админа.
    #  Нужно поиграться с пермишенами в методе create, если мы хотим использовать django-guardian.
    #  Но пока я не особо понимаю использование библиотеки django-guardian, возможно она будет лишняя.
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or request.user == obj.owner
