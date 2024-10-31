def category_images_upload_to(instance, filename):
    folder_name = instance.category.slug
    return f"category/{folder_name}/{filename}"


def category_card_images_upload_to(instance, filename):
    folder_name = instance.card.category.slug
    return f"category/{folder_name}/card/{filename}"
