from celery import shared_task

from .models import Statistics


@shared_task
def update_category_views(category_id: int):
    statistics, created = Statistics.objects.get_or_create(category_id=category_id)
    statistics.increment_views()

    return f"Category ID: {category_id}, Views count: {int(statistics.views_count * 1000)}"


@shared_task
def update_category_purchase(category_id: int):
    statistics, created = Statistics.objects.get_or_create(category_id=category_id)
    statistics.increment_purchases()

    return f"Category ID: {category_id}, Purchases count: {int(statistics.purchases_count * 1000)}"
