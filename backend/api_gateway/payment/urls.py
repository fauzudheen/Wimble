from django.urls import path
from . import views

urlpatterns = [
     path('payments/create-checkout-session/', views.PaymentCreateCheckoutView.as_view()),
     path('payments/webhook/', views.PaymentWebhookView.as_view()),
]
