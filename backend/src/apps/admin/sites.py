from typing import Any

from django.contrib import admin
from django.http import HttpRequest


class AdminSite(admin.AdminSite):
    def each_context(self, request: HttpRequest) -> dict[str, Any]:
        context = super().each_context(request)
        context["deepl_api_key"] = request.META.get("DEEPL_API_KEY", None)
        return context
