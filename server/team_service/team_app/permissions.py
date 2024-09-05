from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from . import models

class IsCreatorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        
        if request.method in permissions.SAFE_METHODS:
            return True
        
        user = models.TeamMember.objects.filter(team_id=obj.id, user_id=request.user.id).first()
        
        if not user:
            print("User is not a member of this team.")
            raise PermissionDenied("User is not a member of this team.") 
        
        
        if user.role != 'admin':
            print("User is not the creator of this team.")
            raise PermissionDenied("User is not the creator of this team.")
        
        return True

class IsOwnerOrCreatorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        obj = view.get_object()

        if request.method in ['PUT', 'PATCH']:
            # Check if the user is the team admin
            if obj.team.members.filter(user_id=request.user.id, role='admin').exists():
                return True
            else:
                print("------------User is not the team admin------------")

        if request.method in ['DELETE']:
            return obj.user_id == request.user.id or obj.team.members.filter(user_id=request.user.id, role='admin').exists() 

        return False 