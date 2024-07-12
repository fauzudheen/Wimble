from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import User
from .serializers import UserSerializer, UserLoginSerializer, AdminLoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from .utils import generate_otp, send_otp
from django.core.cache import cache


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user_data = serializer.validated_data
                email = user_data['email']
                otp = generate_otp()
                send_otp(email, otp)

                user_data['is_active'] = True
                cache.set(f"user_data_{email}", user_data, timeout=300)
                cache.set(f"otp_{email}", otp, timeout=300)
                data = cache.get(f"user_data_{email}")

                return Response({
                    'message': 'OTP sent to your email. Please verify.',
                    'email': email
                }, status=status.HTTP_200_OK)
            else:
                print("----------------errors-------------")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        # Retrieve data from Redis
        stored_otp = cache.get(f"otp_{email}")
        
        if stored_otp and int(stored_otp) == int(otp):
            data = cache.get(f"user_data_{email}")
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                
                # Optionally, clear the cache for this user
                cache.delete(f"user_data_{email}")
                cache.delete(f"otp_{email}")
                
                return Response({
                    'message': 'User created successfully',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        else:
            print("--------------error----------", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
