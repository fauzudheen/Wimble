import jwt
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.conf import settings
import requests
from urllib.parse import parse_qs
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

class JWTAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Get the token from the query string
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token:
            try:
                # Decode the token
                payload = jwt.decode(token, settings.JWT_SIGNING_SECRET_KEY, algorithms=['HS256'])
                user_id = payload['user_id']
                
                # Fetch user info from User Service
                user_info = await self.get_user_info(user_id)
                if user_info:
                    scope['user'] = CustomUser(user_info)
                else:
                    scope['user'] = None
            except jwt.ExpiredSignatureError:
                scope['user'] = None
            except jwt.InvalidTokenError:
                scope['user'] = None
        else:
            scope['user'] = None

        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user_info(self, pk):
        try:
            response = requests.get(f'{USER_SERVICE_URL}/users/{pk}/')
            response.raise_for_status()
            return response.json()
        except requests.RequestException:
            return None