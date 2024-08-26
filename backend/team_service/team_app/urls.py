from django.urls import path
from . import views

urlpatterns = [
    path('teams/', views.TeamListCreateView.as_view()),
    path('teams/<int:pk>/', views.TeamRetrieveUpdateDestroyView.as_view()),
    path('teams/<int:pk>/members/', views.TeamMemberListCreateView.as_view()),
    path('teams/<int:pk>/members/<int:user_id>/', views.TeamMemberRetrieveUpdateDestroyView.as_view()), 
    path('member-teams/', views.MemberTeamListView.as_view()),
    path('teams/<int:pk>/meetings/', views.TeamMeetingListCreateView.as_view()),
    path('teams/<int:pk>/meetings/<int:meeting_id>/', views.TeamMeetingRetrieveUpdateDestroyView.as_view()),
    path('search/', views.SearchView.as_view()),
] 