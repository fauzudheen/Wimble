import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    def post(self, request):
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
            )
            return Response({'id': checkout_session.id})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StripeWebhookView(APIView):
    def post(self, request):
        print("-------------------Stripe Webhook Called------------------")
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            # Here you can provision the subscription for your user
            # You might want to store the customer ID and subscription ID
            customer_id = event['data']['object']['customer']
            subscription_id = event['data']['object']['subscription']
            print("-------------------Checkout Session Completed------------------")
            print("-------------------Customer ID------------------", customer_id)
            print("-------------------Subscription ID------------------", subscription_id)
            # Update your user's subscription status in your database

        elif event['type'] == 'checkout.session.expired': 
            session = event['data']['object']

        return Response({'success': True}) 