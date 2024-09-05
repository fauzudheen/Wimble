# your_app/middleware.py

from django.utils.deprecation import MiddlewareMixin
from django.http import HttpRequest
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

class DebugJWTMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.split()[1] if auth_header.startswith('Bearer ') else None

        if token:
            try:
                JWTAuthentication().authenticate(HttpRequest(request))
            except InvalidToken:
                print('Invalid token')
        else:
            print('No token found')
