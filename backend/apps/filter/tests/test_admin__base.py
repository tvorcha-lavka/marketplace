import pytest
from django.contrib.admin.options import BaseModelAdmin

from apps.admin.sites import AdminSite
from apps.filter.admin import BaseFilterAdmin
from apps.filter.models import FilterType


class TestBaseAdmin:
    @pytest.fixture(autouse=True)
    def setup(self, mocker):
        self.obj = mocker.Mock()
        self.obj.language_code = "en"

        self.related_field_obj = mocker.Mock()
        self.related_field_obj.id = 1
        self.related_field_obj.safe_translation_getter.return_value = "Test Name"

    @pytest.mark.parametrize("with_related_object", (True, False))
    def test_display_field(self, mocker, with_related_object):
        self.obj.related_field = self.related_field_obj if with_related_object else None

        # Mock `reverse` method
        mocker.patch("apps.filter.admin.reverse", return_value="/admin/path/to/object/")

        # Call `_display_field` method
        result = BaseFilterAdmin._display_field(
            obj=self.obj,
            field="name",
            related_field="related_field",
            reverse_path="admin:path",
        )

        # Expected result
        data = '<a href="/admin/path/to/object/">Test Name</a>'
        expected_result = data if with_related_object else "-"

        # Check the result
        assert result == expected_result

    @pytest.mark.parametrize("with_related_object", (True, False))
    def test_display_list_field(self, mocker, with_related_object):
        # Mock related object
        self.obj.related_field = (
            mocker.Mock(
                all=mocker.Mock(
                    return_value=[
                        mocker.Mock(id=1, safe_translation_getter=mocker.Mock(return_value="Value 1")),
                        mocker.Mock(id=2, safe_translation_getter=mocker.Mock(return_value="Value 2")),
                    ]
                )
            )
            if with_related_object
            else None
        )

        # Mock `reverse` method
        mocker.patch("apps.filter.admin.reverse", side_effect=lambda reverse_path, args: f"/admin/obj/{args[0]}/")

        # Call `_display_list_field` method
        result = BaseFilterAdmin._display_list_field(
            obj=self.obj,
            field="name",
            related_field="related_field",
            reverse_path="admin:path",
        )

        # Expected result
        data = '<a href="/admin/obj/1/">Value 1</a>, <a href="/admin/obj/2/">Value 2</a>'
        expected_result = data if with_related_object else "-"

        # Check the result
        assert result == expected_result

    @pytest.mark.parametrize("db_field_in_qs", (True, False))
    def test_formfield_for_dbfield(self, mocker, db_field_in_qs):
        # Mock `super().formfield_for_dbfield()` method
        mock_super_method = mocker.patch.object(BaseModelAdmin, "formfield_for_dbfield")

        # Get an admin model
        admin_model = BaseFilterAdmin(FilterType, AdminSite())

        # Mock request
        request = mocker.Mock()
        request.GET.get.return_value = "en"

        # Mock db_field
        db_field = mocker.Mock()
        db_field.name = "filter_type" if db_field_in_qs else "custom_db_field"

        # Mock `queryset` for FilterType
        mock_qs = mocker.patch.object(FilterType.objects, "all", return_value=mocker.Mock())
        mock_language_qs = mock_qs.return_value.prefetch_related.return_value.language

        # Call `formfield_for_dbfield` method
        form_field = admin_model.formfield_for_dbfield(db_field, request)

        # Check the result
        if db_field_in_qs:
            mock_language_qs.assert_called_once_with("en")
        else:
            mock_language_qs.assert_not_called()

        mock_super_method.assert_called_once()
        assert form_field is not None
