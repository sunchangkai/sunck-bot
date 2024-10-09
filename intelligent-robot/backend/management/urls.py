from rest_framework import routers

from management import views

management_router = routers.SimpleRouter()
management_router.register(r'vectordb', views.VectorDBViewSet)
management_router.register(r'splitter', views.SplitterViewSet)
management_router.register(r'datasource', views.DataSourceViewSet)
management_router.register(r'document', views.DocumentViewSet)

urlpatterns = [

]
urlpatterns += management_router.urls