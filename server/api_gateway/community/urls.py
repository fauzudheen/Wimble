from . import views
from django.urls import path, include

urlpatterns = [
    path('communities/', views.CommunityView.as_view()),
    path('communities/<int:pk>/', views.CommunityView.as_view()),
    path('communities/<int:pk>/members/', views.CommunityMemberView.as_view()),
    path('communities/<int:pk>/members/<int:user_id>/', views.CommunityMemberView.as_view()),
    path('members/<int:pk>/communities/', views.MemberCommunityView.as_view()), 
    path('members/<int:pk>/admined-communities/', views.MemberAdminedCommunityView.as_view()),
]
