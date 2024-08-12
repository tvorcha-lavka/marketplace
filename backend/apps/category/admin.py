from django.contrib import admin

from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    # list settings
    list_display = ("id", "name", "get_parents")
    list_display_links = ("id", "name")
    list_filter = ("active", "parents")
    search_fields = ("name",)

    # object settings
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("parents", "subcategories")

    @admin.display(description="Parents")
    def get_parents(self, obj):
        return " --> ".join(f"[{parent.pk}] {parent.name}" for parent in obj.parents.all())
