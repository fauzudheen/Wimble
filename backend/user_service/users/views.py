from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from . import permissions
from . import models
from . import serializers
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

class SkillListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAdminOrReadOnly]
    serializer_class = serializers.SkillSerializer
    queryset = models.Skill.objects.all()
    pagination_class = None

class SkillRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAdminOrReadOnly]
    serializer_class = serializers.SkillSerializer
    queryset = models.Skill.objects.all()
        
class UserSkillListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = serializers.UserSkillSerializer
    queryset = models.UserSkill.objects.all()
    pagination_class = None

    def perform_create(self, serializer):
        skill_id = self.request.data['skill']
        serializer.save(user_id=self.request.user.id, skill_id=skill_id) 

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return self.queryset.filter(user_id=user_id)

class UserSkillDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.UserSkillSerializer
    queryset = models.UserSkill.objects.all()

class InterestListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAdminOrCreateOnly]
    serializer_class = serializers.InterestSerializer
    queryset = models.Interest.objects.all()
    pagination_class = None

class InterestRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAdminOrReadOnly]
    serializer_class = serializers.InterestSerializer
    queryset = models.Interest.objects.all()

class UserInterestListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = serializers.UserInterestSerializer
    queryset = models.UserInterest.objects.all()
    pagination_class = None

    def perform_create(self, serializer):
        interest_id = self.request.data['interest']
        serializer.save(user_id=self.request.user.id, interest_id=interest_id)

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return self.queryset.filter(user_id=user_id)
    
class UserInterestDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.UserInterestSerializer
    queryset = models.UserInterest.objects.all()
