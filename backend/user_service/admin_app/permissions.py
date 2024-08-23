from rest_framework.permissions import BasePermission
import jwt
from django.conf import settings


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        
        if request.method in ['PUT', 'PATCH']:
            return obj == request.user
        
        if request.method == 'GET':
            return True
        
        return False

class ServiceTokenPermission(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return False

        try:
            token = auth_header.split(' ')[1]
            
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            
            if payload.get('service') == 'payment_service':
                return True
            
            return False
        except jwt.ExpiredSignatureError:
            return False
        except jwt.InvalidTokenError:
            return False
        except IndexError:
            return False