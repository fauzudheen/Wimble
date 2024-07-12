from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        print("-------------request.user-------------", request.user)
        print("-------------obj-------------", obj)
        print("-------------request-------------", request)
        if request.user.is_staff:
            return True
        
        if request.method in ['PUT', 'PATCH']:
            return obj == request.user
        
        if request.method == 'GET':
            return True
        
        return False
