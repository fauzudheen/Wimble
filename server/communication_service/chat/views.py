from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from . import serializers, models
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class TeamMessageListView(generics.ListCreateAPIView):
    serializer_class = serializers.MessageSerializer
    pagination_class = CustomPagination  
    
    def get_queryset(self):
        team_id = self.kwargs['pk']
        return models.Message.objects.filter(room__team_id=team_id)

class MessageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.MessageSerializer
    queryset = models.Message.objects.all()   

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a unique filename
        file_name = default_storage.get_available_name(file_obj.name)

        # Save the file
        file_path = default_storage.save(f'chat_files/{file_name}', ContentFile(file_obj.read()))

        # Get the full URL
        file_url = request.build_absolute_uri(default_storage.url(file_path))

        return Response({'file_url': file_url}, status=status.HTTP_201_CREATED)
    
