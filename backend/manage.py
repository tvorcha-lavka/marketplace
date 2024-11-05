#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from dotenv import load_dotenv

load_dotenv()

environment = os.getenv("MODE", "dev")
postgres_host = os.getenv("POSTGRES_HOST")


def check_db_host():
    if environment == "dev" and postgres_host != "host.docker.internal":
        print(
            "\n\033[91m" + "WARNING: Your environment is DEV.\033[0m"
            "\n\033[91m" + "Note that you will be working with a remote database!\n\033[0m"
        )


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"core.settings.{environment}")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    check_db_host()
    main()
