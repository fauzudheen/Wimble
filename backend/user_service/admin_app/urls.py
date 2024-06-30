from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import UserViewSet, AdminLoginView


urlpatterns = [
    path('users/', UserViewSet.as_view(), name='user-list'),
    path('ad/login/', AdminLoginView.as_view(), name='admin-login'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)