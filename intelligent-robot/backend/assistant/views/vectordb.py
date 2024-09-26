from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from assistant.models import VectorDB


class VectorDBSerializer(CustomModelSerializer):
    class Meta:
        model = VectorDB
        fields = '__all__'


class VectorDBViewSet(CustomModelViewSet):
    queryset = VectorDB.objects.all()
    serializer_class = VectorDBSerializer
    search_fields = ['name']
