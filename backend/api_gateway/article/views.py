from django.shortcuts import render
from utils.services import ARTICLE_SERVICE_URL
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpResponse

class ArticleView(APIView):
    def get(self, request, pk=None):
        if pk:
            service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/"
        else:
            page = request.query_params.get('page', 1)
            service_url = f"{ARTICLE_SERVICE_URL}/articles/?page={page}"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

    def post(self, request):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/"
        
        files = {}
        if 'thumbnail' in request.data:
            files = {'thumbnail': request.data['thumbnail']}
            request.data.pop('thumbnail', None) # Remove the 'thumbnail' key from request.data to avoid treating it as a file

        response = requests.post(
            service_url, 
            data=request.data,
            files=files,
            headers={key: value for key, value in request.headers.items() if key != 'Content-Type'}
        )

        return Response(response.json(), status=response.status_code)

    def put(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/"
        response = requests.put(service_url, data=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def patch(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/"
        files = {}
        if 'thumbnail' in request.data:
            files = {'thumbnail': request.data['thumbnail']}
            request.data.pop('thumbnail', None) # Remove the 'thumbnail' key from request.data to avoid treating it as a file

        response = requests.patch(
            service_url, 
            data=request.data,
            files=files,
            headers={key: value for key, value in request.headers.items() if key != 'Content-Type'}
        )
        return Response(response.json(), status=response.status_code)

    def delete(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/"
        response = requests.delete(service_url, headers=dict(request.headers))
        return Response(status=response.status_code)  

class FeedView(APIView):
    def get(self, request):
        page = request.query_params.get('page', 1)
        service_url = f"{ARTICLE_SERVICE_URL}/feed/?page={page}"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
class TagView(APIView):
    def get(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/tags/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/tags/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def delete(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/article-tags/{pk}/"
        response = requests.delete(service_url, json=request.data, headers=dict(request.headers))
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
    def get(self, request, pk=None, article_id=None):
        if pk:
            service_url = f"{ARTICLE_SERVICE_URL}/article-comments/{pk}/"
        else:
            service_url = f"{ARTICLE_SERVICE_URL}/articles/{article_id}/comments/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
     
    def post(self, request, article_id):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{article_id}/comments/" 
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
    
class ReportView(APIView):
    def get(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/reports/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/{pk}/reports/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

class ArticleByTagView(APIView):
    def get(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/by-tag/{pk}/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
class ArticleByCommunityView(APIView):
    def get(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/articles/by-community/{pk}/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
class UserInteractionView(APIView):
    def get(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/user-interactions/{pk}/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)

class ArticleViewView(APIView):
    def get(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/article-view/{pk}/"
        response = requests.get(service_url, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)
    
    def post(self, request, pk):
        service_url = f"{ARTICLE_SERVICE_URL}/article-view/{pk}/"
        response = requests.post(service_url, json=request.data, headers=dict(request.headers))
        return Response(response.json(), status=response.status_code)