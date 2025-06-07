from functools import wraps
from typing import Any, Callable, TypeVar

from django.core.cache import cache
from django.utils.cache import get_cache_key

T = TypeVar("T", bound=Callable[..., Any])


def clear_view_cache(key_prefix: str) -> Callable[[T], T]:
    def decorator(func: T) -> T:
        @wraps(func)
        def _clear_cache(self: Any, *args: Any, **kwargs: Any) -> Any:
            result = func(self, *args, **kwargs)

            # clear view cache
            cache_key = get_cache_key(self.request, key_prefix=key_prefix)
            cache.delete(cache_key)

            return result

        return _clear_cache  # type: ignore

    return decorator
