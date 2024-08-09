from django.urls import path, include
from . import views

urlpatterns = [
    path('chat/team/<int:pk>/messages/', views.ChatTeamView.as_view()),
    path('chat/messages/<int:pk>/', views.ChatMessageView.as_view()),
    path('notifications/', views.NotificationView.as_view()),
    path('notifications/<int:pk>/', views.NotificationView.as_view()), 
    path('unread-notifications/', views.NotificationView.as_view()),  
]
