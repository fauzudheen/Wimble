from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.exceptions import PermissionDenied

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        print("------request.user-------", request.user)
        print("------obj-----------", obj)
        print("------obj.user_id-----------", obj.user_id)

        if request.method in SAFE_METHODS:
            return True

        if obj.user_id != request.user.id:
            raise PermissionDenied("You are unauthorized to perform this action.")

        return True


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        print("------request.user-------", request.user)
        print("------obj-----------", obj)
        print("------obj-----------", obj)

        if request.method in ['POST']:
            return obj == request.user
        
        if request.method == 'GET':
            return True
        
        return False
class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        print("------request.user-------", request.user)
        print("------obj.user_id-----------", obj.user_id)
        print("------obj-----------", obj)
        print("is_staff", request.user.is_staff) 

        if request.method in SAFE_METHODS:
            return True

        return obj.user_id == request.user.id or request.user.is_staff
    
class IsOwnerOrAdminForArticle(BasePermission):
    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        return obj.author_id == request.user.id or request.user.is_staff

class IsAdminOrCreateOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['POST', 'GET']:
            return True
        return request.user and request.user.is_staff