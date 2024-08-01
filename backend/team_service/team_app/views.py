from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from . import permissions, serializers, models
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    
class TeamListCreateView(generics.ListCreateAPIView):
    queryset = models.Team.objects.all()
    serializer_class = serializers.TeamSerializer 
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        team = serializer.save()
        models.TeamMember.objects.create(user_id=self.request.user.id, team=team, role='admin', request_status='accepted')


class TeamRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Team.objects.all()
    serializer_class = serializers.TeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, permissions.IsCreatorOrReadOnly]

class TeamMemberListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.TeamMemberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        team_id = self.kwargs['pk']
        return models.TeamMember.objects.filter(team_id=team_id)

    def perform_create(self, serializer):
        team_id = self.kwargs['pk']
        serializer.save(user_id=self.request.user.id, team_id=team_id)

class TeamMemberRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView): 
    serializer_class = serializers.TeamMemberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, permissions.IsOwnerOrCreatorOrReadOnly]
    # When there are multiple parameters, you need to customize the get_queryset method, rest_framework will handle the rest
    def get_queryset(self):
        team_id = self.kwargs['pk']
        user_id = self.kwargs['user_id']
        return models.TeamMember.objects.filter(team_id=team_id, user_id=user_id)
    

        



