from .base import EDGE_NGRAM_ANALYZER, language_field_mapping

__all__ = [
    "PRODUCT_INDEX_SETTINGS",
]


PRODUCT_INDEX_SETTINGS = {
    "settings": {
        "analysis": EDGE_NGRAM_ANALYZER,
    },
    "mappings": {
        "properties": {
            "title": {
                "type": "text",
                "analyzer": "autocomplete",
                "search_analyzer": "standard",
                "fields": {
                    "keyword": {"type": "keyword"},
                },
            },
            "description": {
                "type": "text",
                "analyzer": "autocomplete",
                "search_analyzer": "standard",
            },
            "price": {"type": "float"},
            "quantity": {"type": "integer"},
            "active": {"type": "boolean"},
            "draft": {"type": "boolean"},
            "is_vip": {"type": "boolean"},
            "date_published": {"type": "date"},
            "category_id": {"type": "long"},
            "full_path": {
                "type": "object",
                "properties": language_field_mapping(
                    field_type="text",
                    analyzer="autocomplete",
                    search_analyzer="standard",
                ),
            },
            "owner": {
                "type": "object",
                "properties": {
                    "id": {"type": "keyword"},
                    "public_username": {"type": "keyword"},
                },
            },
            "images": {
                "type": "object",
                "properties": {
                    "id": {"type": "keyword"},
                    "hash": {"type": "keyword"},
                },
            },
            "filters": {
                "type": "nested",
                "properties": {
                    "type_id": {"type": "long"},
                    "type": {"type": "keyword"},
                    "value_id": {"type": "long"},
                    "value": {
                        "type": "object",
                        "properties": language_field_mapping(
                            field_type="text",
                            analyzer="autocomplete",
                            search_analyzer="standard",
                        ),
                    },
                },
            },
        }
    },
}
