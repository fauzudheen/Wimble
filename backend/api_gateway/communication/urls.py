from django.urls import path, include
from . import views

urlpatterns = [
    path('chat/', views.ChatView.as_view()),
]
