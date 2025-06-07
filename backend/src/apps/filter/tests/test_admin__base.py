import pytest
from django.contrib.admin.options import BaseModelAdmin
from pytest_mock import MockerFixture

from apps.admin.sites import AdminSite
from apps.filter.admin import BaseFilterAdmin
from apps.filter.models import FilterType


class TestBaseAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker: MockerFixture) -> None:
        self.site = AdminSite()
        self.obj = mocker.Mock()

        self.related_obj = mocker.Mock()
        self.related_obj.pk = 1
        self.related_obj.name = "Test Name"

    @pytest.mark.parametrize("with_related_object", (True, False))
    def test_display_field(self, mocker: MockerFixture, with_related_object: bool) -> None:
        # Mock related object
        self.obj.related_obj = self.related_obj if with_related_object else None

        # Mock `reverse` method
        mocker.patch("apps.filter.admin.reverse", return_value="/admin/path/to/object/")

        # Call `_display_field` method
        result = BaseFilterAdmin._display_field(
            field="name",
            obj=self.obj.related_obj,
            reverse_path="admin:path",
        )

        # Expected result
        data = '<a href="/admin/path/to/object/">Test Name</a>'
        expected_result = data if with_related_object else "-"

        # Check the result
        assert result == expected_result

    @pytest.mark.parametrize("with_related_object", (True, False))
    def test_display_related_fields(self, mocker: MockerFixture, with_related_object: bool) -> None:
        # Mock related object
        self.obj.rel_obj_manager = (
            mocker.Mock(
                all=mocker.Mock(
                    return_value=[
                        mocker.Mock(pk=1, value="Value 1"),
                        mocker.Mock(pk=2, value="Value 2"),
                    ]
                )
            )
            if with_related_object
            else mocker.Mock(all=mocker.Mock(return_value=[]))
        )

        # Mock `reverse` method
        mocker.patch("apps.filter.admin.reverse", side_effect=lambda reverse_path, args: f"/admin/obj/{args[0]}/")

        # Call `_display_related_fields` method
        result = BaseFilterAdmin._display_related_fields(
            field="value",
            rel_obj_manager=self.obj.rel_obj_manager,
            reverse_path="admin:path",
        )

        # Expected result
        data = '<a href="/admin/obj/1/">Value 1</a>, <a href="/admin/obj/2/">Value 2</a>'
        expected_result = data if with_related_object else "-"

        # Check the result
        assert result == expected_result

    @pytest.mark.parametrize("db_field_in_qs", (True, False))
    def test_formfield_for_dbfield(self, mocker: MockerFixture, db_field_in_qs: bool) -> None:
        # Mock `super().formfield_for_dbfield()` method
        mock_super_method = mocker.patch.object(BaseModelAdmin, "formfield_for_dbfield")

        # Get an admin model
        admin_model = BaseFilterAdmin(FilterType, AdminSite())

        # Mock request
        request = mocker.Mock()

        # Mock db_field
        db_field = mocker.Mock()
        db_field.name = "filter_type" if db_field_in_qs else "custom_db_field"

        # Mock `queryset` for FilterType
        mock_qs = mocker.patch.object(FilterType.objects, "all", return_value=mocker.Mock())
        mock_prefetch = mock_qs.return_value.prefetch_related

        # Call `formfield_for_dbfield` method
        form_field = admin_model.formfield_for_dbfield(db_field, request)

        # Check the result
        if db_field_in_qs:
            mock_prefetch.assert_called_once_with("translations")
        else:
            mock_prefetch.assert_not_called()

        mock_super_method.assert_called_once()
        assert form_field is not None
