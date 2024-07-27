from utils.services import COMMUNITY_SERVICE_URL
import requests
from rest_framework.views import APIView
from rest_framework.response import Response

class CommunityView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{COMMUNITY_SERVICE_URL}/communities/{pk}/"
        else:
            service_url = f"{COMMUNITY_SERVICE_URL}/communities/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request):
        service_url = f"{COMMUNITY_SERVICE_URL}/communities/"
        
        files = {}
        if 'profile_image' in request.data:
            files['profile_image'] = request.data['profile_image']
            request.data.pop('profile_image', None)  # Remove 'profile_image' from request.data
        if 'cover_image' in request.data:
            files['cover_image'] = request.data['cover_image']
            request.data.pop('cover_image', None)  # Remove 'cover_image' from request.data

        response = requests.post(
            service_url, 
            data=request.data,
            files=files,
            headers={key: value for key, value in request.headers.items() if key != 'Content-Type'}
        )

        return Response(response.json(), status=response.status_code)

    def patch(self, request, pk):
        service_url = f"{COMMUNITY_SERVICE_URL}/communities/{pk}/"
        
        files = {}
        if 'profile_image' in request.data:
            files['profile_image'] = request.data['profile_image']
            request.data.pop('profile_image', None)  # Remove 'profile_image' from request.data
        if 'cover_image' in request.data:
            files['cover_image'] = request.data['cover_image']
            request.data.pop('cover_image', None)  # Remove 'cover_image' from request.data

        response = requests.patch(
            service_url, 
            data=request.data,
            files=files,
            headers={key: value for key, value in request.headers.items() if key != 'Content-Type'}
        )

        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk):
        service_url = f"{COMMUNITY_SERVICE_URL}/communities/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)
    
class CommunityMemberView(APIView):
    def get(self, request, pk, user_id=None):
        if user_id:
            service_url = f"{COMMUNITY_SERVICE_URL}/communities/{pk}/members/{user_id}/"
        else:
            service_url = f"{COMMUNITY_SERVICE_URL}/communities/{pk}/members/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request, pk):
        service_url = f"{COMMUNITY_SERVICE_URL}/communities/{pk}/members/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk, user_id): 
        service_url = f"{COMMUNITY_SERVICE_URL}/communities/{pk}/members/{user_id}/"
        response = requests.delete(service_url, json=request.data, headers=dict(request.headers))
        return Response(status=response.status_code)

class MemberCommunityView(APIView):
    def get(self, request, pk=None):
        service_url = f"{COMMUNITY_SERVICE_URL}/members/{pk}/communities/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code) 