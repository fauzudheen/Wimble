from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from . import models

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user.is_authenticated:
            raise PermissionDenied("User is not authenticated.")

        try:
            member = models.CommunityMember.objects.get(community=obj, user_id=request.user.id)
            if member.role != 'admin':
                raise PermissionDenied("User is not an admin of this community.")
            return True
        except models.CommunityMember.DoesNotExist:
            raise PermissionDenied("User is not a member of this community.")

class IsCommunityAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS: 
            return True

        community_id = view.kwargs.get('pk') or request.data.get('community_id')
        if not community_id:
            raise PermissionDenied("Community ID is missing.")

        try:
            member = models.CommunityMember.objects.get(community_id=community_id, user_id=request.user.id)
            if member.role != 'admin':
                raise PermissionDenied("User is not an admin of this community.")
            return True
        except models.CommunityMember.DoesNotExist:
            raise PermissionDenied("User is not a member of this community.")

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        try:
            member = models.CommunityMember.objects.get(community=obj, user_id=request.user.id)
            if member.role != 'admin':
                raise PermissionDenied("User is not an admin of this community.")
            return True
        except models.CommunityMember.DoesNotExist:
            raise PermissionDenied("User is not a member of this community.")
