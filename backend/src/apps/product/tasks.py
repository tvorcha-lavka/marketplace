from json import loads
from typing import Any
from uuid import UUID

from celery import Task

from core.celery.client import app

from .dto import OptimizeProductImages
from .models import Product

# from django.core.files.storage import default_storage

# @app.task  # type: ignore[misc]
# def remove_images_task(file_names: list[str]):
#     [default_storage.delete(file_name) for file_name in file_names]


@app.task(name="database.product.create", queue="database.queue", bind=True)  # type: ignore[misc]
def create_db_product_task(self: Task, validated_data: str, user_id: str, session_id: str) -> None:
    """Create product in database and call next task to optimize images."""
    data: dict[str, Any] = loads(validated_data)
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
