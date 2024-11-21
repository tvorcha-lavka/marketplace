def product_image_large_path(instance, filename):
    uuid_folder = instance.product.pk
    return f"products/{uuid_folder}/large/{filename}"


def product_image_medium_path(instance, filename):
    uuid_folder = instance.product.pk
    return f"products/{uuid_folder}/medium/{filename}"


def product_image_small_path(instance, filename):
    uuid_folder = instance.product.pk
    return f"products/{uuid_folder}/small/{filename}"
