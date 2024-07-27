from django.urls import path
from . import views

urlpatterns = [
    path('communities/', views.CommunityListCreateView.as_view()),
    path('communities/<int:pk>/', views.CommunityRetrieveUpdateDestroyView.as_view()),
    path('communities/<int:pk>/members/', views.CommunityMemberListCreateView.as_view()),
    path('communities/<int:pk>/members/<int:user_id>/', views.CommunityMemberRetrieveDestroyView.as_view()),
    path('members/<int:pk>/communities/', views.MemberCommunityListView.as_view()),
]
