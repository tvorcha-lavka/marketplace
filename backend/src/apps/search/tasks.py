from celery import Task

from apps.product.models import Product
from core.celery.client import app
from core.celery.enums import QueueEnum

from .elastic.documents import ProductDocument


@app.task(name="elasticsearch.product.index", queue=QueueEnum.ELASTICSEARCH, bind=True)
def create_or_replace_index_product_task(self: Task, product_id: str) -> None:
    """Index (create or replace) product document in Elasticsearch."""
    try:
        product = Product.objects.get(pk=product_id)
        ProductDocument.index(model=product)
    except Exception as e:
        raise self.retry(exc=e)


@app.task(name="elasticsearch.product.index.update", queue=QueueEnum.ELASTICSEARCH, bind=True)
def update_index_product_task(self: Task, product_id: str, fields: list[str]) -> None:
    """Update product document in Elasticsearch."""
    try:
        product = Product.objects.get(pk=product_id)
        ProductDocument.index_update(model=product, fields=set(fields))
    except Exception as e:
        raise self.retry(exc=e)


@app.task(name="elasticsearch.product.index.delete", queue=QueueEnum.ELASTICSEARCH, bind=True)
def delete_index_product_task(self: Task, product_id: str) -> None:
    """Delete product document from Elasticsearch."""
    try:
        ProductDocument.index_delete(product_id)
    except Exception as e:
        raise self.retry(exc=e)
