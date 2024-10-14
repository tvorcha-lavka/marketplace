from django.contrib import admin


class AdminSite(admin.AdminSite):
    def each_context(self, request):
        context = super().each_context(request)
        context["deepl_api_key"] = request.META.get("DEEPL_API_KEY", None)
        return context
