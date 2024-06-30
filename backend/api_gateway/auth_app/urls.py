from django.urls import path
from .views import UserLoginView, UserSignupView, AdminLoginView, TokenRefreshView, VerifyOtpView

urlpatterns = [
    path('login/', UserLoginView.as_view()),
    path('signup/', UserSignupView.as_view()),
    path('signup/verify-otp/', VerifyOtpView.as_view()),
    path('admin/login/', AdminLoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
]
