from elasticsearch import Elasticsearch

from .settings import elasticsearch_settings

elastic = Elasticsearch(
    hosts=elasticsearch_settings.HOSTS,
    basic_auth=elasticsearch_settings.BASIC_AUTH,
    verify_certs=elasticsearch_settings.VERIFY_CERTS,
)
