from typing import Any, TypeAlias

from django.conf import settings

_LangFieldMapping: TypeAlias = dict[str, dict[str, Any]]

__all__ = [
    "EDGE_NGRAM_ANALYZER",
    "language_field_mapping",
]

EDGE_NGRAM_ANALYZER = {
    "filter": {
        "autocomplete_filter": {
            "type": "edge_ngram",
            "min_gram": 4,
            "max_gram": 20,
        }
    },
    "analyzer": {
        "autocomplete": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": [
                "lowercase",
                "autocomplete_filter",
            ],
        }
    },
}


def language_field_mapping(field_type: str, analyzer: str, search_analyzer: str) -> _LangFieldMapping:
    """Returns language-based field mappings for multilingual string fields."""
    return {
        lang_code: {
            "type": field_type,
            "analyzer": analyzer,
            "search_analyzer": search_analyzer,
            "fields": {
                "keyword": {"type": "keyword"},
            },
        }
        for lang_code, _ in settings.LANGUAGES
    }
