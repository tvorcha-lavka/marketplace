def product_image_path(instance, filename):
    uuid_folder = instance.product.pk
    return f"products/{uuid_folder}/{filename}"
