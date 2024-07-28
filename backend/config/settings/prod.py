from .base import *  # noqa: F403

DEBUG = False
ALLOWED_HOSTS += eval(os.getenv("ALLOWED_PROD_HOSTS"))  # noqa: F405

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True


def create_file_logger(path_to_file):
    return {
        "level": "ERROR",
        "class": "logging.TimedRotatingFileHandler",
        "filename": "/var/log/backend/" + path_to_file,
        "when": "midnight",
        "interval": 1,
        "backupCount": 10,
        "formatter": "verbose",
    }


# Logs
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "django_file": create_file_logger("django/django_errors.log"),
        "celery_worker_file": create_file_logger("celery/worker/celery_worker_errors.log"),
        "celery_beat_file": create_file_logger("celery/beat/celery_beat_errors.log"),
    },
    "loggers": {
        "django": {"handlers": ["django_file"], "level": "ERROR", "propagate": True},
        "celery.worker": {"handlers": ["celery_worker_file"], "level": "ERROR", "propagate": True},
        "celery.beat": {"handlers": ["celery_beat_file"], "level": "ERROR", "propagate": True},
    },
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
}
