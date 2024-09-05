from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings
import requests
from urllib.parse import parse_qs

USER_SERVICE_URL = "http://host.docker.internal:8001"

class CustomUser:
    def __init__(self, user_info):
        self.user_info = user_info

    @property
    def is_authenticated(self):
        return True

    def __getattr__(self, name):
        return self.user_info.get(name)

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract token from query string
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token:
            try:
                # Decode the JWT token
                decoded_data = jwt.decode(token, settings.JWT_SIGNING_SECRET_KEY, algorithms=["HS256"])
                user_id = decoded_data['user_id']
                user_info = await database_sync_to_async(self.get_user_info)(user_id)
                scope['user'] = CustomUser(user_info) if user_info else AnonymousUser()
            except jwt.exceptions.DecodeError:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    def get_user_info(self, user_id):
        try:
            response = requests.get(f'{USER_SERVICE_URL}/users/{user_id}/')
            response.raise_for_status()
            return response.json()
        except requests.RequestException:
            return None