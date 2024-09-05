from utils.services import PAYMENT_SERVICE_URL
import requests
from rest_framework.views import APIView
from rest_framework.response import Response

class PaymentCreateCheckoutView(APIView):
    def post(self, request):
        service_url = f"{PAYMENT_SERVICE_URL}/payments/create-checkout-session/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
class PaymentWebhookView(APIView):
    def post(self, request):
        service_url = f"{PAYMENT_SERVICE_URL}/payments/webhook/"
        response = requests.post(service_url, data=request.body, headers=request.headers)
        return Response(response.json(), status=response.status_code)

class PaymentStatusView(APIView):
    def get(self, request):
        service_url = f"{PAYMENT_SERVICE_URL}/payments/check-payment-status/"
        response = requests.get(service_url, headers=dict(request.headers)) 
        return Response(response.json(), status=response.status_code) 