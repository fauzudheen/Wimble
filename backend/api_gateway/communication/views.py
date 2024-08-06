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

class ChatView(APIView):
    def get(self, request, pk=None):
        service_url = f"{COMMUNICATION_SERVICE_URL}/chat/"

        print("---------------------request.headers---------------------", request.headers)
        
        # List of headers to exclude
        exclude_headers = [
            'content-length',
            'host',
            'user-agent',
            'connection',
            'accept-encoding',
        ]
        
        # Filter headers
        headers = {
            k: v for k, v in request.headers.items()
            if k.lower() not in exclude_headers
        }
        
        response = httpx.get(service_url, headers=headers)
        return Response(response.json(), status=response.status_code)
