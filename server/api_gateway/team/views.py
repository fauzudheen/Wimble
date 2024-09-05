from utils.services import TEAM_SERVICE_URL
import requests
from rest_framework.views import APIView
from rest_framework.response import Response

class TeamView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/"
        else:
            page = request.query_params.get('page', 1)
            service_url = f"{TEAM_SERVICE_URL}/teams/?page={page}"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def post(self, request):
        service_url = f"{TEAM_SERVICE_URL}/teams/"
        files = {}
        if 'profile_image' in request.data:
            files['profile_image'] = request.data['profile_image']
            request.data.pop('profile_image', None) 

        response = requests.post(
            service_url, 
            data=request.data,
            files=files,
            headers={key: value for key, value in request.headers.items() if key != 'Content-Type'}
        )

        return Response(response.json(), status=response.status_code)  
    
    def put(self, request, pk):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/"
        files = {}
        if 'profile_image' in request.data:
            files['profile_image'] = request.data['profile_image']
            request.data.pop('profile_image', None) 

        response = requests.put(
            service_url, 
            data=request.data,
            files=files,
            headers={key: value for key, value in request.headers.items() if key != 'Content-Type'}
        )

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
        print("-------------request.data-------------", request.data)
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
    
class MemberTeamView(APIView):
    def get(self, request):
        page = request.query_params.get('page', 1)
        service_url = f"{TEAM_SERVICE_URL}/member-teams/?page={page}"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    
class TeamMeetingView(APIView):
    def get(self, request, pk, meeting_id=None):
        if meeting_id:
            service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/meetings/{meeting_id}/"
        else:
            service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/meetings/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request, pk):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/meetings/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def put(self, request, pk, meeting_id):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/meetings/{meeting_id}/"   
        response = requests.put(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk, meeting_id):
        service_url = f"{TEAM_SERVICE_URL}/teams/{pk}/meetings/{meeting_id}/"   
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)