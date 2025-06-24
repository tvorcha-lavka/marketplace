from .base import EDGE_NGRAM_ANALYZER, language_field_mapping

__all__ = [
    "CATEGORY_INDEX_SETTINGS",
]


CATEGORY_INDEX_SETTINGS = {
    "settings": {
        "analysis": EDGE_NGRAM_ANALYZER,
    },
    "mappings": {
        "properties": {
            "active": {"type": "boolean"},
            "slug": {"type": "keyword"},
            "url": {"type": "keyword"},
            "parent_id": {
                "type": "long",
                "null_value": -1,
            },
            "title": {
                "type": "object",
                "properties": language_field_mapping(
                    field_type="text",
                    analyzer="autocomplete",
                    search_analyzer="standard",
                ),
            },
            "full_path": {
                "type": "object",
                "properties": language_field_mapping(
                    field_type="text",
                    analyzer="autocomplete",
                    search_analyzer="standard",
                ),
            },
        }
    },
}
