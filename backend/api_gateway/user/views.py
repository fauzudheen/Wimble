from django.http import HttpResponseBadRequest
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.services import USER_SERVICE_URL
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpResponse

class UserView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{USER_SERVICE_URL}/users/{pk}/"
        else:
            page = request.query_params.get('page', 1)
            service_url = f"{USER_SERVICE_URL}/users/?page={page}" 
        
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def put(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/users/{pk}/"
        response = requests.put(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def patch(self, request, pk):
        print("--------request.data--------", request.data)   
        service_url = f"{USER_SERVICE_URL}/users/{pk}/"
        headers = dict(request.headers)
        headers.pop('Content-Type', None) 
        data = request.data.copy()
        json_data = {key: value for key, value in data.items() if not isinstance(value, InMemoryUploadedFile)}
        files_data = {key: (value.name, value, value.content_type) for key, value in data.items() if isinstance(value, InMemoryUploadedFile)}
        response = requests.patch(service_url, data=json_data, files=files_data, headers=headers)
        # This is a general approach to pop image from request.data
        return Response(response.json(), status=response.status_code)

    def delete(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/users/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        try:
            return Response(response.json(), status=response.status_code) 
        except requests.exceptions.JSONDecodeError:
            return Response(status=response.status_code)
 
    def proxy_media_request(request, path):
        user_service_media_url = f"{USER_SERVICE_URL}/media/{path}" 
        response = requests.get(user_service_media_url, stream=True)
        
        if response.status_code == 200:
            response_content = response.content
            content_type = response.headers['Content-Type']
            return HttpResponse(response_content, content_type=content_type)
        else:
            return HttpResponse(status=response.status_code) 
        
class SkillView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{USER_SERVICE_URL}/skills/{pk}/"
        else:
            service_url = f"{USER_SERVICE_URL}/skills/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request):
        service_url = f"{USER_SERVICE_URL}/skills/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def patch(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/skills/{pk}/"
        response = requests.patch(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/skills/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)
    
class UserSkillView(APIView):
    def get(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/users/{pk}/skills/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code) 
    
    def post(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/users/{pk}/skills/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/user-skills/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)
    
class InterestView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{USER_SERVICE_URL}/interests/{pk}/"
        else:
            service_url = f"{USER_SERVICE_URL}/interests/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request):
        service_url = f"{USER_SERVICE_URL}/interests/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def patch(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/interests/{pk}/"
        response = requests.patch(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/interests/{pk}/" 
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)
    
class UserInterestView(APIView):
    def get(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/users/{pk}/interests/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/users/{pk}/interests/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/user-interests/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)
    
class UserInterestBatchView(APIView):
    def post(self, request, pk):
        print("--------------POST called in user_interest_batch view---------------")
        service_url = f"{USER_SERVICE_URL}/users/{pk}/interests-batch/"
        print("----------------request.data----------------", request.data)
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        print("-----------------headers-----------------", dict(request.headers))
        return Response(response.json(), status=response.status_code)

class RelationView(APIView):

    def get(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/relations/{pk}/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/relations/{pk}/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
class FollowerView(APIView):
    def get(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/followers/{pk}/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

class FollowingView(APIView):
    def get(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/followings/{pk}/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    