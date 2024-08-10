from utils.services import COMMUNICATION_SERVICE_URL
import requests
import httpx
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings

# class ChatView(APIView):
#     def get(self, request, pk=None):
#         service_url = f"{COMMUNICATION_SERVICE_URL}/chat/"

#         with httpx.Client() as client:
#             response = client.get(service_url) 

#         return Response(response.json(), status=response.status_code) 

class ChatTeamView(APIView):
    def get(self, request, pk=None):
        page = request.query_params.get('page', 1)
        service_url = f"{COMMUNICATION_SERVICE_URL}/chat/teams/{pk}/messages/?page={page}"

        exclude_headers = ['content-length','host','user-agent','connection', 'accept-encoding',]
        
        headers = {
            k: v for k, v in request.headers.items()
            if k.lower() not in exclude_headers
        }
        
        response = httpx.get(service_url, headers=headers)
        return Response(response.json(), status=response.status_code) 

class ChatMessageView(APIView):
    def get(self, request, pk=None):
        service_url = f"{COMMUNICATION_SERVICE_URL}/chat/messages/{pk}/"

        exclude_headers = ['content-length','host','user-agent','connection', 'accept-encoding',]
        
        headers = {
            k: v for k, v in request.headers.items() 
            if k.lower() not in exclude_headers
        }
        
        response = httpx.get(service_url, headers=headers)
        return Response(response.json(), status=response.status_code)
    
class NotificationView(APIView):
    def get(self, request):
        service_url = f"{COMMUNICATION_SERVICE_URL}/notifications/"
        
        exclude_headers = ['content-length','host','user-agent','connection', 'accept-encoding',]
        
        headers = {
            k: v for k, v in request.headers.items() 
            if k.lower() not in exclude_headers
        }
        
        response = httpx.get(service_url, headers=headers)
        return Response(response.json(), status=response.status_code)
    
    def patch(self, request, pk): 
        service_url = f"{COMMUNICATION_SERVICE_URL}/notifications/{pk}/"
        
        exclude_headers = ['content-length','host','user-agent','connection', 'accept-encoding',]
        
        headers = {
            k: v for k, v in request.headers.items() 
            if k.lower() not in exclude_headers
        }

        print("----------------request.data----------------", request.data)
        
        response = httpx.patch(service_url, json=request.data, headers=headers) 
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk):
        service_url = f"{COMMUNICATION_SERVICE_URL}/notifications/{pk}/"
        
        exclude_headers = ['content-length','host','user-agent','connection', 'accept-encoding',]
        
        headers = {
            k: v for k, v in request.headers.items() 
            if k.lower() not in exclude_headers
        }
        
        response = httpx.delete(service_url, headers=headers)
        return Response(response.json(), status=response.status_code)
    
class UnreadNotificationView(APIView):
    def get(self, request):
        service_url = f"{COMMUNICATION_SERVICE_URL}/unread-notifications/"
        
        exclude_headers = ['content-length','host','user-agent','connection', 'accept-encoding',]
        
        headers = {
            k: v for k, v in request.headers.items() 
            if k.lower() not in exclude_headers
        }
        
        response = httpx.get(service_url, headers=headers)
        return Response(response.json(), status=response.status_code) 
    
class UploadFileView(APIView):
    def post(self, request):
        service_url = f"{COMMUNICATION_SERVICE_URL}/chat/upload-file/" 
        
        exclude_headers = ['content-length','host','user-agent','connection', 'accept-encoding',]
        
        headers = {
            k: v for k, v in request.headers.items() 
            if k.lower() not in exclude_headers
        }
        
        response = httpx.post(service_url, files=request.data, headers=headers)
        return Response(response.json(), status=response.status_code)