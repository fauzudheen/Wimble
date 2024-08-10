from django.urls import path
from . import views


urlpatterns = [ 
    path('teams/<int:pk>/messages/', views.TeamMessageListView.as_view()),
    path('messages/<int:pk>/', views.MessageRetrieveUpdateDestroyView.as_view()),
    path('upload-file/', views.FileUploadView.as_view()),
]