def path_to_large_image(instance, filename):
    uuid_folder = instance.product.pk
    return f"products/{uuid_folder}/large/{filename}"


def path_to_medium_image(instance, filename):
    uuid_folder = instance.product.pk
    return f"products/{uuid_folder}/medium/{filename}"


def path_to_small_image(instance, filename):
    uuid_folder = instance.product.pk
    return f"products/{uuid_folder}/small/{filename}"
