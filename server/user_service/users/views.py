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
from .utils import send_otp
from django.core.cache import cache
from .producer import kafka_producer
import random
from django.db.models import Q
from .suggestions import get_users_to_follow_suggestions
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from utils.metrics_common import Metrics

class SignupView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user_data = serializer.validated_data
                email = user_data['email']
                otp = random.randint(100000, 999999)
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

class SkillRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAdminOrReadOnly]
    serializer_class = serializers.SkillSerializer
    queryset = models.Skill.objects.all()
        
class UserSkillListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = serializers.UserSkillSerializer
    queryset = models.UserSkill.objects.all()

    def perform_create(self, serializer):
        skill_id = self.request.data['skill']
        serializer.save(user_id=self.request.user.id, skill_id=skill_id) 
        Metrics.upload_urls_created.inc()

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

class InterestRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAdminOrReadOnly]
    serializer_class = serializers.InterestSerializer
    queryset = models.Interest.objects.all()

class UserInterestListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = serializers.UserInterestSerializer
    queryset = models.UserInterest.objects.all()

    def perform_create(self, serializer):
        interest_id = self.request.data['interest']
        serializer.save(user_id=self.request.user.id, interest_id=interest_id)

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return self.queryset.filter(user_id=user_id)
    
class UserInterestBatchCreateView(generics.CreateAPIView):
    serializer_class = serializers.UserInterestBatchSerializer
    queryset = models.UserInterest.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['pk'] = self.kwargs.get('pk') 
        return context


class UserInterestDestroyView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.UserInterestSerializer
    queryset = models.UserInterest.objects.all()

class RelationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        follower_id = request.user.id
        following_id = pk
        try:
            relation = models.Relation.objects.get(follower_id=follower_id, following_id=following_id)
            return Response({"message": "Followed"}, status=status.HTTP_200_OK)
        except models.Relation.DoesNotExist:
            return Response({"message": "No relation found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        follower_id = request.user.id
        following_id = pk
        try:
            relation = models.Relation.objects.get(follower_id=follower_id, following_id=following_id)
            relation.delete()
            return Response({"message": "Unfollowed successfully"}, status=status.HTTP_200_OK)
        except models.Relation.DoesNotExist:
            relation = models.Relation.objects.create(follower_id=follower_id, following_id=following_id)
            relation_data = {
                'id': relation.id, 
                'follower_id': follower_id,
                'following_id': following_id
            }
            kafka_producer.produce_message('relations', relation.id, relation_data)
            return Response({"message": "Followed successfully"}, status=status.HTTP_201_CREATED)

class FollowersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        queryset = models.Relation.objects.filter(following_id=pk)
        serializer = serializers.RelationSerializer(queryset, many=True)
        return Response(serializer.data)
    
class FollowingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        queryset = models.Relation.objects.filter(follower_id=pk)
        serializer = serializers.RelationSerializer(queryset, many=True)
        return Response(serializer.data)
    
class UserSearchView(APIView):
    def get(self, request):
        query = request.GET.get('query')
        if not query:
            return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)
        users = models.User.objects.filter(Q(first_name__icontains=query) | Q(last_name__icontains=query))
        serializer = serializers.UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class InterestSearchView(APIView):
    def get(self, request):
        query = request.GET.get('query')
        if not query:
            return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)
        interests = models.Interest.objects.filter(name__icontains=query)
        serializer = serializers.InterestSerializer(interests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ReportListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        reportee_id = self.kwargs['pk']
        return models.Report.objects.filter(reportee_id=reportee_id)
    
    def perform_create(self, serializer):
        reportee_id = self.kwargs['pk']
        serializer.save(reportee_id=reportee_id, reporter_id=self.request.user.id) 

class ReportListView(generics.ListAPIView):
    serializer_class = serializers.ReportSerializer
    permission_classes = [IsAdminUser] 
    queryset = models.Report.objects.all() 

class ReportDestroyView(APIView):
    permission_classes = [IsAdminUser] 

    def delete(self, request, *args, **kwargs):
        reportee_id = self.kwargs['pk']
        reports = models.Report.objects.filter(reportee_id=reportee_id)
        reports_count = reports.count()
        
        if reports_count == 0:
            return Response({"message": "No reports found for this article."}, status=status.HTTP_404_NOT_FOUND)
        
        reports.delete()
        return Response({"message": f"{reports_count} reports deleted."}, status=status.HTTP_204_NO_CONTENT)
    
class FetchAllUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = models.User.objects.all()
        serializer = serializers.UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UsersToFollowSuggestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = get_users_to_follow_suggestions(request.user.id)
        serializer = serializers.UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({"message": "Both old and new passwords are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"message": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if old_password == new_password:
            return Response({"message": "New password must be different from the current password."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({"message": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
    
class ForgotPasswordView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            otp = random.randint(100000, 999999)
            send_otp(email, otp)

            cache.set(f"otp_{email}", otp, timeout=300)

            return Response({
                'message': 'OTP sent to your email. Please verify.',
                'email': email
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ResetPasswordVerifyOTPView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            otp = request.data.get('otp')

            stored_otp = cache.get(f"otp_{email}")
            
            if stored_otp and int(stored_otp) == int(otp):
                return Response({
                    'message': 'OTP verified successfully',
                }, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ResetPasswordView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            user = models.User.objects.get(email=email)

            user.set_password(password)
            user.save()

            return Response({
                'message': 'Password reset successfully',
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)