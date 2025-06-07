from typing import Any

from rest_framework.serializers import CharField, Serializer


class RouteSerializer(Serializer[Any]):
    reverse_name = CharField()
