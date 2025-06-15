from celery import Task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from apps.user_auth.models import VerificationCode
from core.celery.client import app
from core.celery.enums import QueueEnum

from .dto import BaseEmail, EmailVerification


@app.task(name="email.notification.verification", queue=QueueEnum.NOTIFICATION, bind=True)
def send_verification_code_task(self: Task, json_str: str) -> None:
    try:
        dto = EmailVerification.model_validate_json(json_str)

        code, new_obj = VerificationCode.objects.get_or_create(email=dto.recipient, email_type=dto.email_type)
        code = code if new_obj else code.re_create()  # re-create code if re-request to send email

        email = EmailMultiAlternatives(
            subject=dto.subject,
            body=dto.body.replace("<VERIFICATION_CODE>", str(code)),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[dto.recipient],
        )
        context = {
            "code": str(code),
            "expire_in": code.expire_in,
            "aws_domain": settings.AWS_S3_CUSTOM_DOMAIN,
        }

        html_content = render_to_string(dto.template, context)
        email.attach_alternative(html_content, "text/html")

        email.send()
    except Exception as e:  # pragma: no cover
        raise self.retry(exc=e)


@app.task(name="email.notification.welcome", queue=QueueEnum.NOTIFICATION, bind=True)
def send_welcome_email_task(self: Task, json_str: str) -> None:
    try:
        dto = BaseEmail.model_validate_json(json_str)
        email = EmailMultiAlternatives(
            subject=dto.subject,
            body=dto.body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[dto.recipient],
        )
        context = {
            "main_page_url": settings.BASE_FRONTEND_URL,
            "aws_domain": settings.AWS_S3_CUSTOM_DOMAIN,
        }

        html_content = render_to_string(dto.template, context)
        email.attach_alternative(html_content, "text/html")

        email.send()
    except Exception as e:  # pragma: no cover
        raise self.retry(exc=e)
