from argparse import RawTextHelpFormatter
from contextlib import contextmanager
from importlib import import_module
from typing import Any, Generator, TypeAlias

from django.core.management.base import BaseCommand, CommandParser

from apps.search.elastic.documents import BaseDocument

_Documents: TypeAlias = dict[str, type[BaseDocument[Any]]]


class Command(BaseCommand):

    help = "Index documents to Elasticsearch"  # noqa: VNE003

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

        self.documents = self.autodiscover_documents(
            module="apps.search.elastic.documents",
        )

    @staticmethod
    def autodiscover_documents(module: str) -> _Documents:
        """Autodiscover documents from specified module."""
        return {
            index_name: obj
            for obj in import_module(module).__dict__.values()
            if isinstance(obj, type) and issubclass(obj, BaseDocument)
            if (index_name := getattr(obj, "index_name", None))
        }

    def add_arguments(self, parser: CommandParser) -> None:
        """Add command arguments to parser."""
        parser.add_argument(
            "document",
            type=str,
            nargs="?",
            choices=(docs := list(self.documents.keys())),
            help=f"Document to index.\nAvailable documents: {docs}",
        )
        parser.add_argument(
            "--all",
            action="store_true",
            help="Index all documents.",
        )
        parser.add_argument(
            "-f",
            "--force-recreate",
            default=False,
            action="store_true",
            help="Force recreate Elasticsearch indices.",
        )

    def create_parser(self, prog_name: str, subcommand: str, **kwargs: Any) -> CommandParser:
        """Create command parser with raw text formatter."""
        parser = super().create_parser(prog_name, subcommand)
        parser.formatter_class = RawTextHelpFormatter
        return parser

    @contextmanager
    def index_manager(self, doc_name: str) -> Generator[None, Any, None]:
        """
        Context manager for indexing documents.
        This manager will print indexing status.
        """
        try:
            self.stdout.write(
                msg=f"Indexing '{doc_name}' documents...",
                style_func=self.style.MIGRATE_LABEL,
            )

            yield  # run indexing

            self.stdout.write(
                msg=f"Indexing of '{doc_name}' documents is complete!",
                style_func=self.style.SUCCESS,
            )
        except Exception as e:
            self.stdout.write(
                msg=f"Indexing of '{doc_name}' documents is failed.\nError: {e}",
                style_func=self.style.ERROR,
            )

    def get_documents(self, name: str) -> _Documents:
        """Returns dictionary of documents to index them."""

        if name == "all":
            return self.documents

        return {name: self.documents[name]}

    def handle(self, *args: Any, **options: Any) -> None:
        """Handle the command to indexing documents to Elasticsearch."""
        force_recreate = options["force_recreate"]

        if (name := options["document"]) or options["all"]:
            documents = self.get_documents(name or "all")

            for doc_name, document in documents.items():
                with self.index_manager(doc_name):
                    document.index_all(force_recreate)

        else:
            self.print_help("manage.py", "index_documents")
