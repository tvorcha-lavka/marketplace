from typing import Awaitable, Callable, TypeAlias

from django.http import HttpRequest
from django.urls import resolve
from rest_framework.response import Response

from .signals import category_viewed

GetResponse: TypeAlias = Callable[[HttpRequest], Response | Awaitable[Response]]


class CategoryStatisticMiddleware:
    def __init__(self, get_response: GetResponse) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> Response | Awaitable[Response]:
        resolver_match = resolve(request.path)

        if request.method == "GET" and resolver_match.view_name == "category-detail":
            category_viewed.send(sender=self.__class__, category_id=resolver_match.kwargs.get("pk"))

        return self.get_response(request)
