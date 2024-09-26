from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from assistant.models import DataSource


class DataSourceSerializer(CustomModelSerializer):
    class Meta:
        model = DataSource
        fields = '__all__'


class DataSourceViewSet(CustomModelViewSet):
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer
    search_fields = ['name']
