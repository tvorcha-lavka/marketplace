from django.contrib import admin
from django.contrib.admin import ModelAdmin

from apps.user_auth.models import VerificationCode


@admin.register(VerificationCode)
class VerificationCodeAdmin(ModelAdmin[VerificationCode]):
    list_display = ("email", "code", "expires_at")
    exclude = ("uuid",)
