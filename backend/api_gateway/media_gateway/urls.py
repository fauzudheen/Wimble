from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^media/.*$', views.MediaView.as_view()),
    re_path(r'^http://127.0.0.1:8000/media/.*$', views.MediaView.as_view()),
]