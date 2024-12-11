from copy import copy
from re import sub

from rest_framework.permissions import AllowAny


def remove_auth_for_public_routes(result, generator, **kwargs):  # noqa: F841
    def normalize_path(path):
        """Let's unify paths by replacing parameters with {param}."""
        path = sub(r"<\w+:(\w+)>", r"{param}", path)  # Replacing typed parameters
        return sub(r"[<{]\w+[}>]", r"{param}", path)  # Replacing untyped parameters

    # Normalize paths from OpenAPI schema
    normalized_paths = {normalize_path(path): path for path in result["paths"].keys()}

    for endpoint in generator.endpoints:
        raw_path, _, method, view = endpoint
        actions = getattr(view, "actions", None)
        normalized_path = normalize_path(raw_path)

        # Check if there is a path in the scheme after normalization
        openapi_path = normalized_paths.get(normalized_path)
        if not openapi_path:
            continue

        # Checking permissions
        default_permission_classes = copy(view.cls.permission_classes)

        for method, operation in result["paths"][openapi_path].items():
            view.cls.permission_classes = default_permission_classes

            if actions:  # get permissions for ViewSet
                setattr(view.cls, "action", actions[method])
                view.cls.get_permissions(view.cls)

            if AllowAny in view.cls.permission_classes:
                operation["security"] = []  # Removing the locks for public routes

    return result
