import os

from django.test import RequestFactory
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from core.tests.typing import UsersTuple


def test_admin_site_each_context(users: UsersTuple, mocker: MockerFixture) -> None:
    mocker.patch.object(AdminSite, "get_log_entries", return_value=[])
    admin_site = AdminSite()
    factory = RequestFactory()

    request = factory.get("/admin/")
    request.user = users.admin

    deepl_api_key = os.environ.get("DEEPL_API_KEY", None)
    request.META["DEEPL_API_KEY"] = deepl_api_key

    context = admin_site.each_context(request)
    assert context["deepl_api_key"] == deepl_api_key
