from django.urls import path
from . import views

urlpatterns = [
    path('teams/', views.TeamView.as_view()),
    path('teams/<int:pk>/', views.TeamView.as_view()),
    path('teams/<int:pk>/members/', views.TeamMemberView.as_view()),
    path('teams/<int:pk>/members/<int:user_id>/', views.TeamMemberView.as_view()),
    path('member-teams/', views.MemberTeamView.as_view()),
    path('teams/<int:pk>/meetings/', views.TeamMeetingView.as_view()),
    path('teams/<int:pk>/meetings/<int:meeting_id>/', views.TeamMeetingView.as_view()),
]
