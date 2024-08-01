from utils.services import TEAM_SERVICE_URL
import requests
from rest_framework.views import APIView
from rest_framework.response import Response

class TeamView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/"
        else:
            service_url = f"{TEAM_SERVICE_URL}/teams/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def post(self, request):
        service_url = f"{TEAM_SERVICE_URL}/teams/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def put(self, request, pk):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/"
        response = requests.put(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)
    
class TeamMemberView(APIView):
    def get(self, request, pk, user_id=None):
        if user_id:
            service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/members/{user_id}/"
        else:
            service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/members/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request, pk):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/members/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def put(self, request, pk, user_id):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/members/{user_id}/"
        response = requests.put(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk, user_id):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/members/{user_id}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)