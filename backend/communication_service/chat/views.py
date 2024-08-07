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