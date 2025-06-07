#!/usr/bin/env python
"""
Entrypoint for all available services of the `tvorcha-lavka-web` project.
"""
from itertools import chain
from re import sub

from pydantic import BaseModel


def to_snake_case(text: str) -> str:
    if "-" in text:
        return text.replace("-", "_").lower()
    return sub(r"(?<!^)(?=[A-Z])", "_", text).lower()


def to_kebab_case(text: str) -> str:
    if "_" in text:
        return text.replace("_", "-").lower()
    return sub(r"(?<!^)(?=[A-Z])", "-", text).lower()


class CeleryWorkers(BaseModel):
    database: list[str]
    notification: list[str]
    statistics: list[str]

    @classmethod
    def list(cls) -> list[str]:
        return list(to_kebab_case(key) for key in cls.model_fields.keys())


class CeleryConfig(CeleryWorkers):
    beat: list[str]


def run_django(_type: str) -> None:
    from subprocess import run

    asgi = [
        ["python", "-m", "gunicorn", "core.asgi:application"],
        ["--worker-class", "uvicorn.workers.UvicornWorker"],
        ["--bind", "0.0.0.0:8000"],
        ["--workers", "3"],
    ]
    wsgi = [
        ["python", "manage.py", "runserver", "0.0.0.0:8000"],
    ]
    type_map = {
        "asgi": list(chain.from_iterable(asgi)),
        "wsgi": list(chain.from_iterable(wsgi)),
    }
    commands = [
        ["python", "manage.py", "migrate"],
        ["django-admin", "compilemessages"],
        type_map[_type],
    ]

    for cmd in commands:
        run(cmd, check=True)


def run_celery(worker: str) -> None:
    from core.celery.client import app

    celery_config = CeleryConfig(
        beat=[
            "beat",
            "--loglevel=info",
        ],
        database=[
            "worker",
            "--loglevel=info",
            "--autoscale=10,1",
            "--max-tasks-per-child=50",
            "--queues=database.queue",
        ],
        notification=[
            "worker",
            "--loglevel=info",
            "--autoscale=10,1",
            "--max-tasks-per-child=50",
            "--queues=notification.queue",
        ],
        statistics=[
            "worker",
            "--loglevel=info",
            "--autoscale=5,1",
            "--max-tasks-per-child=25",
            "--queues=statistics.queue",
        ],
    )

    app.start(getattr(celery_config, worker))


def run_pytest(cov_report: bool = False) -> None:
    from pytest import main as run

    _base_params = [
        ["--config-file=/tmp/pyproject.toml"],
        ["--rootdir=/src"],
    ]
    _cov_params = [
        ["--cov-config=/tmp/pyproject.toml"],
        ["-m", "not (xfail or skip)"],
        ["--cov"],
    ]

    base_params = list(chain.from_iterable(_base_params))
    cov_params = list(chain.from_iterable(_cov_params))

    run(base_params + cov_params if cov_report else base_params)


def main() -> None:
    from argparse import ArgumentParser, RawTextHelpFormatter

    parser = ArgumentParser(formatter_class=RawTextHelpFormatter)

    parser.add_argument(
        "--beat",
        required=False,
        action="store_true",
        help="Runs celery beat.",
    )
    parser.add_argument(
        "--worker",
        required=False,
        choices=(names := CeleryWorkers.list()),
        metavar="<arg>",
        help=f"Runs specified celery worker.\nargs={names}",
    )
    parser.add_argument(
        "--web-app",
        required=False,
        choices=(types := ["asgi", "wsgi"]),
        metavar="<arg>",
        help=f"Runs django web app.\nargs={types}",
    )
    parser.add_argument(
        "--pytest",
        required=False,
        action="store_true",
        help="Runs pytest.",
    )
    parser.add_argument(
        "--pytest-cov",
        required=False,
        action="store_true",
        help="Runs pytest with coverage.",
    )

    args = parser.parse_args()

    if args.web_app:
        run_django(args.web_app)

    elif args.beat:
        run_celery("beat")

    elif args.worker:
        run_celery(to_snake_case(args.worker))

    elif args.pytest:
        run_pytest()

    elif args.pytest_cov:
        run_pytest(cov_report=True)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
