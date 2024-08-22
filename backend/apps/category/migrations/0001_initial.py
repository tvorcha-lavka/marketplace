# Generated by Django 5.0.6 on 2024-08-08 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255, verbose_name="name")),
                ("description", models.TextField(blank=True, verbose_name="description")),
                ("slug", models.SlugField(max_length=255, verbose_name="slug")),
                ("url", models.URLField(blank=True, verbose_name="url")),
                ("order", models.PositiveSmallIntegerField(verbose_name="order")),
                ("active", models.BooleanField(default=True, verbose_name="active")),
                ("parents", models.ManyToManyField(blank=True, related_name="parent_set", to="category.category")),
                (
                    "subcategories",
                    models.ManyToManyField(blank=True, related_name="subcategory_set", to="category.category"),
                ),
            ],
            options={
                "verbose_name": "Category",
                "verbose_name_plural": "Categories",
                "db_table": "category",
                "ordering": ["id", "order"],
            },
        ),
    ]
