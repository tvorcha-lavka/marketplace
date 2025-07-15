from typing import Any

from pydantic import BaseModel, Field

from .choices import EmailType


class BaseEmail(BaseModel):
    recipient: str
    subject: str = ""
    body: str = ""
    template: str
    template_context: dict[str, Any] = Field(default_factory=dict)


class EmailVerification(BaseEmail):
    email_type: EmailType
