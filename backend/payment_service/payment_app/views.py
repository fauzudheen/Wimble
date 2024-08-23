import stripe
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
import jwt
from rest_framework.permissions import IsAuthenticated
import uuid


stripe.api_key = settings.STRIPE_SECRET_KEY
USER_SERVICE_URL = "http://host.docker.internal:8001"

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("POST Checkout Session")  
        print("Request.user.id", request.user.id)  
        try:
            price_id = request.data.get('priceId')
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=settings.FRONTEND_URL + 'payment-success/',
                cancel_url=settings.FRONTEND_URL + 'payment-cancelled/',   
                metadata={
                    'user_id': request.user.id
                }
            )
            return Response({'id': checkout_session.id})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def generate_service_token(user_id):
    payload = {
        'service': 'payment_service',
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow(),
        'jti': str(uuid.uuid4()),
        'token_type': 'access',
        'user_id': user_id,  
    }
    return jwt.encode(payload, settings.JWT_SIGNING_SECRET_KEY, algorithm='HS256')

class StripeWebhookView(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            
            customer_id = session['customer']
            subscription_id = session['subscription']
            customer_email = session['customer_details']['email']
            payment_status = session['payment_status']

            print("Checkout Session Completed")
            print("Customer ID:", customer_id)
            print("Subscription ID:", subscription_id)

            if payment_status == 'paid':
                success = self.process_subscription(customer_email, customer_id, subscription_id, session['invoice'], request, event)
                if not success:
                    return Response({'error': 'Failed to process subscription'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'success': True})

    def process_subscription(self, email, customer_id, subscription_id, invoice_id, request, event):
        user_update_success = self.update_user_subscription(email, 'premium', customer_id, subscription_id, event)
        
        if user_update_success:
            print("User subscription updated successfully")
            return True
        else:
            print("Failed to update user subscription. Initiating refund.")
            refund_success = self.initiate_refund(invoice_id)
            if refund_success:
                print("Refund initiated successfully")
            else:
                print("Failed to initiate refund")
            return False

    def update_user_subscription(self, email, new_tier, customer_id, subscription_id, event):
        user_id = event['data']['object']['metadata']['user_id']
        service_url = f"{USER_SERVICE_URL}/users-payment/{user_id}/"

        expiry_date = (datetime.now() + timedelta(days=30)).date()
        
        data = {
            "account_tier": new_tier,
            "stripe_customer_id": customer_id,
            "stripe_subscription_id": subscription_id,
            "subscription_expiry": expiry_date.isoformat()  
        }
        
        try:
            token = generate_service_token(user_id) 
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            }
            response = requests.patch(service_url, json=data, headers=headers)
            response.raise_for_status()   
            return True
        except requests.RequestException as e:
            print(f"Failed to update user subscription: {str(e)}")
            print(f"Response status code: {e.response.status_code}")
            print(f"Response content: {e.response.content}")
            return False

    def initiate_refund(self, invoice_id):
        try:
            refund = stripe.Refund.create(invoice=invoice_id)
            print(f"Refund initiated: {refund.id}")
            return True
        except stripe.error.StripeError as e:
            print(f"Failed to initiate refund: {str(e)}")
            return False 
