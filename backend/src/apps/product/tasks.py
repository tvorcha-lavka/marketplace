from datetime import date
from json import loads
from logging import getLogger
from typing import Any
from uuid import UUID

from celery import Task, chain
from celery.result import AsyncResult

from core.celery.client import app
from core.celery.enums import QueueEnum

from .dto import OptimizeProductImages
from .images import ImagePresetEnum
from .models import Product

# from django.core.files.storage import default_storage

# @app.task
# def remove_images_task(file_names: list[str]):
#     [default_storage.delete(file_name) for file_name in file_names]

logger = getLogger(__name__)


@app.task(name="product.create", queue=QueueEnum.ORCHESTRATOR)
def create_product_chain_task(user_email: str, product_id: str, is_draft: bool, json_str: str) -> None:
    """Orchestrates product creation with optional publishing via chained Celery tasks."""
    tasks = chain(
        # 1. Create database entry for product
        app.signature(
            "database.product.create",
            queue=QueueEnum.DATABASE,
            kwargs={"json_str": json_str},
            immutable=True,
        ),
        # 2. Processing images
        app.signature(
            "optimize.product.images",
            queue=QueueEnum.FILE_OPTIMIZER,
            immutable=False,
        ),
        # 3. Uploading images to S3 Bucket
        app.signature(
            "upload.s3.product.images",
            queue=QueueEnum.FILE_UPLOADER_S3,
            immutable=False,
        ),
        # 4. Create database entry for images
        app.signature(
            "upload.db.product.images",
            queue=QueueEnum.FILE_UPLOADER_DB,
            immutable=False,
        ),
        # 5. Indexing the product in Elasticsearch
        app.signature(
            "elasticsearch.product.index",
            queue=QueueEnum.ELASTICSEARCH,
            kwargs={"product_id": product_id},
            immutable=True,
        ),
    )

    if is_draft:
        tasks |= chain(
            # 6. Notify user about product created
            # TODO: need to be implemented
            app.signature(
                "notify.user.product.created",
                queue=QueueEnum.NOTIFICATION,
                kwargs={"user_email": user_email},
                immutable=True,
            ),
        )
    else:
        tasks |= chain(
            # 6. Make the product visible in the store
            app.signature(
                "database.product.publish",
                queue=QueueEnum.DATABASE,
                kwargs={"product_id": product_id},
                immutable=True,
            ),
            # 7. Update product index in Elasticsearch
            app.signature(
                "elasticsearch.product.index.update",
                queue=QueueEnum.ELASTICSEARCH,
                kwargs={
                    "product_id": product_id,
                    "fields": ["active", "date_published"],
                },
                immutable=True,
            ),
            # 8. Notify user about product published
            # TODO: need to be implemented
            app.signature(
                "notify.user.product.published",
                queue=QueueEnum.NOTIFICATION,
                kwargs={"user_email": user_email},
                immutable=True,
            ),
        )

    tasks.apply_async(
        link_error=app.signature(
            "product.create.handle_error",
            queue=QueueEnum.ORCHESTRATOR,
            kwargs={
                "user_email": user_email,
                "product_id": product_id,
                "is_draft": is_draft,
            },
            immutable=True,
        )
    )


@app.task(name="product.create.handle_error", queue=QueueEnum.ORCHESTRATOR, bind=True)
def create_product_handle_error_task(self: Task, user_email: str, product_id: str, is_draft: bool) -> None:
    """Handle error for product creation."""
    task = AsyncResult(self.request.parent_id)

    message = f"Task: '{task.id}' failed. Handler '{self.name}'.\n"
    exception = f"Exception: {task.result}\n{task.traceback}"

    logger.error(message + exception)

    # -----------------------------------------------------------------------
    # TODO: implement logic to send telegram error notification for developer
    # -----------------------------------------------------------------------

    # ---------------------------------------------------------------
    # TODO: implement logic to send email error notification for user
    # ---------------------------------------------------------------


@app.task(name="database.product.create", queue=QueueEnum.DATABASE, bind=True)
def create_db_product_task(self: Task, json_str: str) -> str:
    """Create database entry for product."""
    data: dict[str, Any] = loads(json_str)

    owner_id = UUID(data.get("owner_id"))
    session_id = UUID(data.pop("session_id"))

    filters = data.pop("filters", [])

    try:
        product = Product.objects.create(**data)
        product.filters.set(filters)
    except Exception as e:
        raise self.retry(exc=e)

    optimize_dto = OptimizeProductImages(
        user_id=owner_id,
        session_id=session_id,
        product_id=product.pk,
        preset=ImagePresetEnum.to_pydantic(),
    )

    return optimize_dto.model_dump_json()


@app.task(name="database.product.publish", queue=QueueEnum.DATABASE, bind=True)
def product_publish_task(self: Task, product_id: str) -> None:
    """Make the product visible in the store."""
    try:
        product = Product.objects.get(id=product_id)

        product.active = True
        product.date_published = date.today()

        product.save(update_fields=["active", "date_published"])

    except Exception as e:
        raise self.retry(exc=e)
