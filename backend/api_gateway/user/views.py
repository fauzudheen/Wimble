from django.http import HttpResponseBadRequest
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.services import USER_SERVICE_URL
import logging

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
        service_url = f"{USER_SERVICE_URL}/users/{pk}/"
        response = requests.patch(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def delete(self, request, pk):
        service_url = f"{USER_SERVICE_URL}/users/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        try:
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.JSONDecodeError:
            return Response(status=response.status_code)
 