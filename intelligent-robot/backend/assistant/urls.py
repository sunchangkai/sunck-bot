from rest_framework import routers

from assistant import views

assistant_url = routers.SimpleRouter()
assistant_url.register(r'vectordb', views.VectorDBViewSet)
assistant_url.register(r'splitter', views.SplitterViewSet)


urlpatterns = [

]
urlpatterns += assistant_url.urls