from rest_framework.serializers import CharField, Serializer, URLField


class RouteSerializer(Serializer):
    url = URLField()
    reverse_name = CharField()
