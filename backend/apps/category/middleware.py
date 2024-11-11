from django.urls import resolve

from .signals import category_viewed


class CategoryStatisticMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        resolver_match = resolve(request.path)

        if request.method == "GET" and resolver_match.view_name == "category-detail":
            category_viewed.send(sender=self.__class__, category_id=resolver_match.kwargs.get("pk"))

        return self.get_response(request)
