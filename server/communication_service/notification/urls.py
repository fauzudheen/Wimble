from django.urls import path
from . import views


urlpatterns = [ 
    path('notifications/', views.NotificationListView.as_view()),
    path('unread-notifications/', views.UnreadNotificationListView.as_view()),
    path('notifications/<int:pk>/', views.NotificationUpdateDestroyView.as_view()),
    path('notification-preferences/', views.NotificationPreferenceRetrieveUpdateView.as_view()),
]