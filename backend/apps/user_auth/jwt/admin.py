from django.contrib import admin

from apps.user_auth.models import VerificationCode


@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ("email", "code", "expires_at")
    exclude = ("uuid",)
