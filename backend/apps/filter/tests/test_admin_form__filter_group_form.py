import pytest
from parler.managers import TranslatableQuerySet

from apps.category.managers import CategoryQuerySet
from apps.filter.forms import FilterGroupForm
from apps.filter.models import FilterGroup


class TestFilterGroupForm:
    @pytest.fixture(autouse=True)
    def setup(self, mocker, rf):
        # Create mock for FilterGroup instance
        self.mocked_instance = mocker.MagicMock(spec=FilterGroup)

        # Create mocked request
        mocked_request = rf.get("/admin/filter/filtergroup/1/change/")
        mocked_request.LANGUAGE_CODE = "en"

        # Create mock for meta
        mocked_meta = mocker.patch("apps.filter.forms.FilterGroupForm._meta")
        mocker.patch.object(mocked_meta.formfield_callback.keywords, "get", return_value=mocked_request)

    def test_init_form(self):
        # Form initialization
        form = FilterGroupForm(instance=self.mocked_instance)
        fields = FilterGroupForm.Meta.fields

        # Get query set's from form
        qs_set = (form.fields[field].queryset for field in fields)

        # Expected Data
        qs_types = (CategoryQuerySet, TranslatableQuerySet, TranslatableQuerySet)
        pref_rel_lookups = (("translations",), ("translations",), ("translations", "filter_type__translations"))
        sel_rel_lookups = (False, False, {"filter_type": {}})

        # Check that queryset has valid `prefetch_related` and `select_related` lookups and a valid `type`
        for qs, qs_type, pref_rel, sel_rel in zip(qs_set, qs_types, pref_rel_lookups, sel_rel_lookups):
            assert qs._prefetch_related_lookups == pref_rel
            assert qs._query.select_related == sel_rel
            assert isinstance(qs, qs_type)
