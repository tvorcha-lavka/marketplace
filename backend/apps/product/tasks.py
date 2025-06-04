from json import loads
from uuid import UUID

from celery import Task, shared_task
from django.core.files.storage import default_storage

from core.celery import app

from .dto import OptimizeProductImages
from .models import Product


@shared_task
def remove_images_task(file_names: list[str]):
    [default_storage.delete(file_name) for file_name in file_names]


@app.task(name="create.db.product", queue="database.queue", bind=True, max_retries=3)
def create_db_product_task(self: Task, validated_data: str, user_id: str, session_id: str):
    """Create product in database and call next task to optimize images."""
    data: dict = loads(validated_data)
    filters = data.pop("filters", [])

    try:
        product = Product.objects.create(**data, owner_id=user_id)
        product.filters.set(filters)
    except Exception as e:
        raise self.retry(exc=e)

    optimize_dto = OptimizeProductImages(
        user_id=UUID(user_id),
        session_id=UUID(session_id),
        product_id=product.pk,
    )

    kwargs = {"json_str": optimize_dto.model_dump_json()}
    app.send_task(name="optimize.product.images", queue="optimize.queue", kwargs=kwargs)
