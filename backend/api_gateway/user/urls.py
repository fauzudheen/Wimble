from django.urls import path
from .views import UserView
from django.urls import re_path
from django.views.static import serve
from django.conf import settings
from . import views

urlpatterns = [
    path('users/', UserView.as_view()),
    path('users/<int:pk>/', UserView.as_view()),
    re_path(r'^user_service/media/(?P<path>.*)$', UserView.proxy_media_request),
    path('skills/', views.SkillView.as_view()),
    path('skills/<int:pk>/', views.SkillView.as_view()),
    path('users/<int:pk>/skills/', views.UserSkillView.as_view()),
    path('user-skills/<int:pk>/', views.UserSkillView.as_view()),
    path('interests/', views.InterestView.as_view()),
    path('interests/<int:pk>/', views.InterestView.as_view()),
    path('users/<int:pk>/interests/', views.UserInterestView.as_view()),
    path('users/<int:pk>/interests-batch/', views.UserInterestBatchView.as_view()),
    path('user-interests/<int:pk>/', views.UserInterestView.as_view()),
    path('relations/<int:pk>/', views.RelationView.as_view()),
    path('followers/', views.FollowerView.as_view()),
    path('followings/', views.FollowingView.as_view()),
    path('users/<int:pk>/reports/', views.ReportView.as_view()),
    path('user-reports/', views.ReportView.as_view()),
    path('user-reports/<int:pk>/', views.ReportView.as_view()),
    path('pricing/', views.PricingView.as_view()),
    path('pricing/<int:pk>/', views.PricingView.as_view()),
    path('users-to-follow-suggestions/', views.UsersToFollowSuggestionsView.as_view()),
]
