from rest_framework import serializers
from users.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
            
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