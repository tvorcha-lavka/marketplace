import contextlib

from django.utils.translation import gettext_lazy as _
from rest_framework.pagination import PageNumberPagination

from apps.product.choices import ProductPagePagination


class ProductPageNumberPagination(PageNumberPagination):
    page_size_query_param = "page_size"
    page_size_query_description = _("Available number of results per page: %s") % ProductPagePagination.values

    def get_page_size(self, request):
        with contextlib.suppress(KeyError, ValueError):
            page_size = int(request.query_params[self.page_size_query_param])

            if page_size not in ProductPagePagination.values:
                raise ValueError

            return page_size
        return ProductPagePagination.SMALL
