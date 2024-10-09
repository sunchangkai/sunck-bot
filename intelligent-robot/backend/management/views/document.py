from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from dvadmin.utils.json_response import SuccessResponse, ErrorResponse
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from management.models import Document, DataSource


class DocumentSerializer(CustomModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'


class DocumentViewSet(CustomModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    search_fields = ['name', "data_source"]

    @action(methods=["POST"], detail=False, permission_classes=[IsAuthenticated])
    def upload_data(self, request):
        try:
            datasource_id = request.data['datasource_id']
            name = request.data['name']
            url = request.data['url']
            file_url = request.data['file_url']
            size = request.data['size']

            datasource = DataSource.objects.get(id=datasource_id)
            Document.objects.create(name=name, path=file_url, size=size, data_source=datasource)
            return SuccessResponse(msg="Upload success")
        except Exception as e:
            return ErrorResponse(msg=str(e))

