from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from . import models

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    followers_count = serializers.SerializerMethodField()
    followings_count = serializers.SerializerMethodField()
    skill_count = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 
                  'profile', 'date_joined', 'is_superuser', 'is_staff', 'is_active', 
                  'tagline', 'bio', 'followers_count', 'followings_count', 'account_tier',
                  'skill_count', 'stripe_customer_id', 'stripe_subscription_id', 'subscription_expiry']    
     
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_followings_count(self, obj):
        return obj.followings.count() 
    
    def get_skill_count(self, obj):
        return obj.skills.count()
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        print(f"Authenticating user {username} with password {password}")

        user = authenticate(username=username, password=password)
        print(f"User authenticated: {user}")

        if user:
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")
        else:
            raise serializers.ValidationError("Unable to log in with provided credentials.")

        attrs['user'] = user
        return attrs

            
class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            if not user.is_superuser:
                raise serializers.ValidationError("User is not a superuser.")
        else:
            raise serializers.ValidationError("Unable to log in with provided credentials.")
            
        return user
    
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Skill
        fields = "__all__"

class UserSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.SerializerMethodField()
    class Meta:
        model = models.UserSkill
        fields = ["id", "skill", "skill_name"]

    def get_skill_name(self, obj):
        return obj.skill.name

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Interest
        fields = "__all__"

class UserInterestSerializer(serializers.ModelSerializer):
    interest_name = serializers.SerializerMethodField()
    class Meta:
        model = models.UserInterest
        fields = ["id", "interest", "interest_name"]

    def get_interest_name(self, obj):
        return obj.interest.name
    
class UserInterestBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserInterest
        fields = ["id"]
    
    def create(self, validated_data):
        interests_data = self.context['request'].data.get('interests')
         
        user_id = self.context['pk']
 
        user_interests = [
            models.UserInterest(user_id=user_id, interest_id=interest['id'])
            for interest in interests_data
        ]

        return models.UserInterest.objects.bulk_create(user_interests) 
    
class RelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Relation
        fields = "__all__"

class ReportSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    reportee = UserSerializer(read_only=True)
    class Meta:
        model = models.Report 
        fields = '__all__'
        read_only_fields = ['id', 'reporter', 'reportee','created_at']