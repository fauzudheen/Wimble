import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import requests
import os

USER_SERVICE_URL = os.getenv('USER_SERVICE_URL')  

class CustomUser:
    def __init__(self, user_info):
        self.user_info = user_info

    @property
    def is_authenticated(self):
        return True

    def __getattr__(self, name):
        return self.user_info.get(name)

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, settings.JWT_SIGNING_SECRET_KEY, algorithms=['HS256'])
            print("------------------payload-----------------", payload)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        user_id = payload['user_id']

        print("------------------user_id-----------------", user_id)
        
        # Fetch user info from User Service
        user_info = self.get_user_info(user_id)
        if not user_info:
            raise AuthenticationFailed('User not found')
        
        custom_user = CustomUser(user_info)
        request.user = custom_user
        return (custom_user, None)

    def get_user_info(self, pk):
        try:
            response = requests.get(f'{USER_SERVICE_URL}/users/{pk}/')
            response.raise_for_status()
            user_info = response.json()
        
            return user_info
        except requests.RequestException:
            return None