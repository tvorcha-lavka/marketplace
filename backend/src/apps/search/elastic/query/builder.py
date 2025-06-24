from math import floor
from re import UNICODE, sub
from typing import Any, Self
from unicodedata import normalize

from rest_framework.request import Request


class ElasticMultiSearchBuilder:

    __slots__ = (
        "_fields",
        "_nested_fields",
        "_lang_code",
        "_parts",
        "_query",
        "_query_terms",
        "_size",
    )

    def __init__(self, request: Request):
        """Initialize the query builder with the request object."""
        self._fields: list[str] = []
        self._nested_fields: list[str] = []

        self._lang_code = request.LANGUAGE_CODE
        self._parts: list[dict[str, Any]] = []

        self._query = request.query_params["query"]
        self._query_terms = self._get_query_terms(self.query)

        self._size = 100

    @property
    def body(self) -> list[dict[str, Any]]:
        """Return the constructed query body."""
        return self._parts

    @property
    def query(self) -> str:
        """Return the query string."""
        return self._query

    @staticmethod
    def _calculate_fuzziness(term: str) -> int:
        """Returns fuzziness value based on query length."""
        length = len(term)
        if length <= 2:
            return 0
        elif 3 <= length <= 5:
            return 1
        return 2

    @staticmethod
    def _get_query_terms(query: str) -> list[str]:
        """Remove punctuation, normalize Unicode, lowercase, and split into terms."""
        text = sub(r"[^\w\s\-]", "", normalize("NFKD", query), flags=UNICODE)
        return [
            term
            # Split text into lowercase terms
            for term in text.strip().lower().split()
            # Filter out terms that are too short and skip if term have any digits
            if (len(term) >= 4 or any(char.isdigit() for char in term))
        ]

    @staticmethod
    def _split_boost(field: str) -> tuple[str, int | None]:
        """Split field into name and boost value."""
        if "^" in field:
            name, boost = field.rsplit("^", 1)
            return name, int(boost)

        return field, None

    def add(  # noqa: CFQ002
        self,
        index: str,
        fields: list[str],
        nested_fields: list[str] | None = None,
        translatable_fields: list[str] | None = None,
        nested_translatable_fields: list[str] | None = None,
        size: int | None = None,
        collapse_field: str | None = None,
    ) -> Self:
        """Add an index and query block to the request body."""
        self._fields = fields + self._format_fields(translatable_fields)
        self._nested_fields = (nested_fields or []) + self._format_fields(nested_translatable_fields)

        meta = {"index": index}
        body = {
            "query": self._get_es_query(),
            "min_score": 0.1,
            "size": size or self._size,
        }

        if collapse_field:
            if any(field.startswith(collapse_field) for field in translatable_fields or []):
                collapse_field = self._format_fields([collapse_field])[0]

            body["collapse"] = {"field": f"{collapse_field}.keyword"}

        self._parts += [meta, body]

        return self

    def _format_fields(self, translatable_fields: list[str] | None = None) -> list[str]:
        """Format translatable fields with language code and optional boost."""
        formatted_fields: list[str] = []

        for field in translatable_fields or []:
            field_name, boost = self._split_boost(field)

            field_name = field_name + f".{self._lang_code}"
            formatted_fields.append(field_name + f"^{boost}" if boost else field_name)

        return formatted_fields

    def _get_es_query(self) -> dict[str, Any]:
        """Return elastic query based on query terms and fuzziness values."""
        return {
            "bool": {
                "should": self._get_should_clauses(),
                "minimum_should_match": self._get_minimum_should_match(),
                "filter": {"term": {"active": True}},
            }
        }

    def _get_should_clauses(self) -> list[dict[str, Any]]:
        """Return list of should clauses for elastic query."""
        clauses = []

        # Add `multi_match` for query terms
        for term, fuzziness in self._get_query_terms_with_fuzziness():
            clauses.append(
                {
                    "multi_match": {
                        "query": term,
                        "fuzziness": fuzziness,
                        "fields": self._fields,
                        "type": "best_fields",
                    }
                }
            )
            for nested_field in self._nested_fields:
                nested_field, _ = self._split_boost(nested_field)
                clauses.append(
                    {
                        "nested": {
                            "path": nested_field.split(".")[0],
                            "query": {
                                "match": {
                                    nested_field: {
                                        "query": term,
                                        "fuzziness": fuzziness,
                                    }
                                }
                            },
                        }
                    }
                )

        # Add `match_phrase`, `match` & `term` for title field if it exists in fields
        for title in [field for field in self._fields if field.startswith("title")]:
            digit_terms = [term for term in self._query_terms if term.isdigit()]
            title, _ = self._split_boost(title)

            for term in digit_terms:
                clauses.append(
                    {
                        "match": {
                            title: {
                                "query": term,
                                "boost": 20,
                            }
                        }
                    }
                )

            clauses.append(
                {
                    "match_phrase": {
                        title: {
                            "query": self._query,
                            "boost": 50,
                        }
                    }
                }
            )

            clauses.append(
                {
                    "term": {
                        f"{title}.keyword": {
                            "value": self._query,
                            "boost": 100,
                        }
                    }
                }
            )

        return clauses

    def _get_query_terms_with_fuzziness(self) -> list[tuple[str, int]]:
        """Return query terms with calculated fuzziness values."""
        return [(term, self._calculate_fuzziness(term)) for term in self._query_terms if not term.isdigit()]

    def _get_minimum_should_match(self) -> int:
        """Return dynamic value based on length of query term."""
        term_count = len(self._query_terms)
        return max(1, floor(term_count * 0.5))
