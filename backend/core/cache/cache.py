from functools import wraps

from django.core.cache import cache
from django.utils.cache import get_cache_key


def clear_view_cache(key_prefix: str):
    def decorator(func):
        @wraps(func)
        def _clear_cache(self, *args, **kwargs):
            # call wrapped func
            result = func(self, *args, **kwargs)

            # clear view cache
            cache_key = get_cache_key(self.request, key_prefix=key_prefix)
            cache.delete(cache_key)

            return result

        return _clear_cache

    return decorator
