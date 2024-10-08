from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import SignupView, LoginView, VerifyOTPView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views


urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('skills/', views.SkillListCreateView.as_view()),
    path('skills/<int:pk>/', views.SkillRetrieveUpdateDestroyView.as_view()),
    path('interests/', views.InterestListCreateView.as_view()),
    path('interests/<int:pk>/', views.InterestRetrieveUpdateDestroyView.as_view()),
    path('users/<int:pk>/skills/', views.UserSkillListCreateView.as_view()),
    path('user-skills/<int:pk>/', views.UserSkillDestroyView.as_view()),
    path('users/<int:pk>/interests-batch/', views.UserInterestBatchCreateView.as_view()),
    path('users/<int:pk>/interests/', views.UserInterestListCreateView.as_view()),
    path('user-interests/<int:pk>/', views.UserInterestDestroyView.as_view()),
    path('relations/<int:pk>/', views.RelationView.as_view(), name='relation-toggle'),
    path('followers/<int:pk>/', views.FollowersView.as_view(), name='followers'),
    path('followings/<int:pk>/', views.FollowingsView.as_view(), name='followings'),
    path('search/users/', views.UserSearchView.as_view()),
    path('search/tags/', views.InterestSearchView.as_view()),
    path('users/<int:pk>/reports/', views.ReportListCreateView.as_view()),
    path('user-reports/', views.ReportListView.as_view()), 
    path('user-reports/<int:pk>/', views.ReportDestroyView.as_view()),  
    path('fetchall-users/', views.FetchAllUsersView.as_view()),  
    path('users-to-follow-suggestions/', views.UsersToFollowSuggestionsView.as_view()),
    path('change-password/', views.ChangePasswordView.as_view()),
    path('forgot-password/', views.ForgotPasswordView.as_view()),
    path('reset-password/verify-otp/', views.ResetPasswordVerifyOTPView.as_view()),
    path('reset-password/', views.ResetPasswordView.as_view()),
]