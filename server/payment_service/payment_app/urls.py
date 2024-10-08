from django.urls import path
from .views import CreateCheckoutSessionView, StripeWebhookView, CheckPaymentStatusView, FetchAllPaymentsView

urlpatterns = [
    path('payments/create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('payments/webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('payments/check-payment-status/', CheckPaymentStatusView.as_view()),
    path('fetchall-payments/', FetchAllPaymentsView.as_view()),
]
