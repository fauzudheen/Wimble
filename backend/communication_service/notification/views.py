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


class NotificationListView(generics.ListAPIView):
    serializer_class = serializers.NotificationSerializer
    
    def get_queryset(self):
        return models.Notification.objects.filter(receiver_id=self.request.user.id)
    
class UnreadNotificationListView(generics.ListAPIView):
    serializer_class = serializers.NotificationSerializer
    
    def get_queryset(self):
        return models.Notification.objects.filter(receiver_id=self.request.user.id, is_read=False)
    
class NotificationUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.NotificationSerializer 

    def get_object(self):
        return models.Notification.objects.get(id=self.kwargs['pk']) 
    
    
class NotificationPreferenceRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated] 

    def get_object(self):
        return models.NotificationPreference.objects.get(user_id=self.request.user.id)