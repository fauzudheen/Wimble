from django.urls import path
from . import views

urlpatterns = [
    path('teams/', views.TeamListCreateView.as_view()),
    path('teams/<int:pk>/', views.TeamRetrieveUpdateDestroyView.as_view()),
    path('teams/<int:pk>/members/', views.TeamMemberListCreateView.as_view()),
    path('teams/<int:pk>/members/<int:user_id>/', views.TeamMemberRetrieveUpdateDestroyView.as_view()), 
] 