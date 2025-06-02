# from django.db.models.signals import post_delete
# from django.dispatch import receiver

# from apps.product.models import ProductImage

# from .tasks import remove_images_task

# TODO: fix this. We need to delete the images from the storage after the product is deleted
# @receiver(post_delete, sender=ProductImage)
# def delete_category_image(sender, instance, **kwargs):  # noqa: F841
#     sizes = ["small", "medium", "large"]
#     images_to_delete = [getattr(instance, f"image_{size}").name for size in sizes]
#
#     remove_images_task.apply_async(
#         args=(images_to_delete,),
#         queue="low_priority",
#         priority=10,
#     )
