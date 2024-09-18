from django.conf import settings
from social_django.utils import load_backend, load_strategy


class BackendMixin:
    service_name = None
    redirect_uri = None

    def get_backend(self, request):
        strategy = load_strategy(request)
        redirect_uri = settings.BASE_FRONTEND_URL + self.redirect_uri
        return load_backend(strategy, self.service_name, redirect_uri=redirect_uri)
