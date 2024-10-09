from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from management.models import Splitter


class SplitterSerializer(CustomModelSerializer):
    class Meta:
        model = Splitter
        fields = '__all__'


class SplitterViewSet(CustomModelViewSet):
    queryset = Splitter.objects.all()
    serializer_class = SplitterSerializer
    search_fields = ['name']

