from django.shortcuts import render
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.services import USER_SERVICE_URL


class UserSignupView(APIView):
    def post(self, request):
        service_url = f"{USER_SERVICE_URL}/signup/"
        response = requests.post(service_url, data=request.data)
        return Response(response.json(), status=response.status_code)

class VerifyOtpView(APIView):
    def post(self, request):
        service_url = f"{USER_SERVICE_URL}/signup/verify-otp/"
        response = requests.post(service_url, data=request.data)
        return Response(response.json(), status=response.status_code)

class UserLoginView(APIView):
    def post(self, request):
        service_url = f"{USER_SERVICE_URL}/login/"
        response = requests.post(service_url, data=request.data)
        return Response(response.json(), status=response.status_code)
    
class AdminLoginView(APIView):
    def post(self, request):
        service_url = f"{USER_SERVICE_URL}/ad/login/"
        response = requests.post(service_url, data=request.data)
        return Response(response.json(), status=response.status_code)
    
class TokenRefreshView(APIView):
    def post(self, request):
        service_url = f"{USER_SERVICE_URL}/token/refresh/"
        response = requests.post(service_url, data=request.data)
        return Response(response.json(), status=response.status_code)
