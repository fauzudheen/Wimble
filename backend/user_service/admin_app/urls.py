from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import UserListView, UserRetrieveUpdateDestroyView, AdminLoginView


urlpatterns = [
    path('users/', UserListView.as_view()),
    path('users/<int:pk>/', UserRetrieveUpdateDestroyView.as_view()),
    path('ad/login/', AdminLoginView.as_view()),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)