from rest_framework.serializers import CharField, Serializer


class RouteSerializer(Serializer):
    reverse_name = CharField()
