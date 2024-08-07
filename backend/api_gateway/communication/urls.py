from django.urls import path, include
from . import views

urlpatterns = [
    path('chat/team/<int:pk>/messages/', views.ChatTeamView.as_view()),
    path('chat/messages/<int:pk>/', views.ChatMessageView.as_view()),
]
