from django.shortcuts import render
from utils.services import ARTICLE_SERVICE_URL
import requests
from rest_framework.views import APIView
from rest_framework.response import Response


class ArticleView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/"
        else:
            service_url = f"{ARTICLE_SERVICE_URL}/articles/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def post(self, request):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/" 
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def put(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/"
        response = requests.put(service_url, data=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def patch(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/"
        response = requests.patch(service_url, data=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def delete(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)  


class LikeView(APIView):
    def get(self, request):
        article_id = request.query_params.get('article_id')
        service_url = f"{ARTICLE_SERVICE_URL}/article-like/"
        params = {'article_id': article_id}
        response = requests.get(service_url, params=params, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request):
        service_url = f"{ARTICLE_SERVICE_URL}/article-like/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request):
        article_id = request.query_params.get('article_id')
        service_url = f"{ARTICLE_SERVICE_URL}/article-like/"
        params = {'article_id': article_id}
        response = requests.delete(service_url, params=params, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

 
class CommentView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{ARTICLE_SERVICE_URL}/article-comments/{pk}/"
        else:
            service_url = f"{ARTICLE_SERVICE_URL}/article-comments/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request):
        service_url = f"{ARTICLE_SERVICE_URL}/article-comments/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def patch(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/article-comments/{pk}/"
        response = requests.patch(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def delete(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/article-comments/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)