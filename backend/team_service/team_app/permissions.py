from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from . import models

class IsCreatorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if obj.admin_id != request.user.id:
            raise PermissionDenied("User is not the creator of this team.")
        return True

class IsOwnerOrCreatorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if obj.team_admin_id == request.user.id or obj.user_id == request.user.id:
            return True
        
        raise PermissionDenied("User is not authorized to access this resource.")