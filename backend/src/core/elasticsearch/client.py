from elasticsearch import Elasticsearch

from .settings import elasticsearch_settings

elastic = Elasticsearch(
    hosts=elasticsearch_settings.HOSTS,
    http_auth=elasticsearch_settings.HTTP_AUTH,
    verify_certs=elasticsearch_settings.VERIFY_CERTS,
)
