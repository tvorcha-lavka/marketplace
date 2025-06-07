from celery import Task

from core.celery.client import app

from .models import Statistics


@app.task(name="statistics.category.increment.views", queue="statistics.queue", bind=True)  # type: ignore[misc]
def update_category_views_task(self: Task, category_id: int) -> str:
    try:
        statistics, created = Statistics.objects.get_or_create(category_id=category_id)
        statistics.increment_views()
        return f"Category ID: {category_id}, Views count: {int(statistics.views_count * 1000)}"
    except Exception as e:
        raise self.retry(exc=e)


@app.task(name="statistics.category.increment.purchases", queue="statistics.queue", bind=True)  # type: ignore[misc]
def update_category_purchase_task(self: Task, category_id: int) -> str:
    try:
        statistics, created = Statistics.objects.get_or_create(category_id=category_id)
        statistics.increment_purchases()
        return f"Category ID: {category_id}, Purchases count: {int(statistics.purchases_count * 1000)}"
    except Exception as e:
        raise self.retry(exc=e)
