from collections import namedtuple

import pytest
from django.urls import reverse

TCSchema = namedtuple("TestCasesSchema", ["model"])
testcases = [TCSchema("FilterValue"), TCSchema("FilterType"), TCSchema("FilterGroup")]


@pytest.mark.django_db
@pytest.mark.parametrize("test_case", testcases)
class TestAdminViews:
    @pytest.fixture(autouse=True)
    def setup(self, admin_auth, test_case: TCSchema):
        self.model_name = test_case.model.lower()
        self.admin = admin_auth()

    def test_list_view(self):
        """Test the `list` view for models in the admin panel."""
        url = reverse(f"admin:filter_{self.model_name}_changelist")
        response = self.admin.get(url)
        assert response.status_code == 200

    def test_add_view(self):
        """Test the `add` view for models in the admin panel."""
        url = reverse(f"admin:filter_{self.model_name}_add")
        response = self.admin.get(url)
        assert response.status_code == 200
