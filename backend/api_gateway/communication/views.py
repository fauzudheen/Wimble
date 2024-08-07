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

        print("---------------------request.headers---------------------", request.headers)
        
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

        print("---------------------request.headers---------------------", request.headers)
        
        exclude_headers = ['content-length','host','user-agent','connection', 'accept-encoding',]
        
        headers = {
            k: v for k, v in request.headers.items() 
            if k.lower() not in exclude_headers
        }
        
        response = httpx.get(service_url, headers=headers)
        return Response(response.json(), status=response.status_code)