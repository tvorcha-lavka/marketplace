from django.db.models.signals import ModelSignal

email_verification_signal = ModelSignal(use_caching=True)
reset_password_signal = ModelSignal(use_caching=True)
