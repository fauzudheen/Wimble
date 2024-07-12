from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import SignupView, LoginView, VerifyOTPView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),

]