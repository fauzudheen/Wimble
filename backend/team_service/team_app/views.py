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
from django.http import Http404
from .permissions import IsOwnerOrCreatorOrReadOnly

class CustomPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    
class TeamListCreateView(generics.ListCreateAPIView):
    queryset = models.Team.objects.all()
    serializer_class = serializers.TeamSerializer 
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]  

    def perform_create(self, serializer):
        try:
            team = serializer.save()
            models.TeamMember.objects.create(user_id=self.request.user.id, team=team, role='admin', request_status='accepted')
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  

    def get_serializer_context(self):
        return {'request': self.request} 


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
    def get_object(self):
        team_id = self.kwargs['pk']
        user_id = self.kwargs['user_id']
        print(f"Getting TeamMember with team_id: {team_id} and user_id: {user_id}")
        try:
            return models.TeamMember.objects.get(team_id=team_id, user_id=user_id)
        except models.TeamMember.DoesNotExist:
            raise Http404("TeamMember does not exist")
        
    def perform_destroy(self, instance):
        print(f"Attempting to destroy TeamMember with team_id: {self.kwargs['pk']} and user_id: {self.kwargs['user_id']}")
        pk = self.kwargs['pk']
        user_id = self.kwargs['user_id']
        other_members = models.TeamMember.objects.filter(team_id=pk).exclude(user_id=user_id)
        if other_members:
            if instance.role == 'admin':
                new_admin = other_members.order_by('created_at').first()
                new_admin.role = 'admin'
                new_admin.save()
        else:
            models.Team.objects.get(id=pk).delete()
        instance.delete()
    
class MemberTeamListView(generics.ListAPIView):
    serializer_class = serializers.TeamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = CustomPagination

    def get_queryset(self):
        user_id = self.request.user.id
        return models.Team.objects.filter(members__user_id=user_id, members__request_status='accepted')   
    
class TeamMeetingListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.TeamMeetingSerializer

    def get_queryset(self):
        team_id = self.kwargs['pk']
        return models.TeamMeeting.objects.filter(team_id=team_id)

    def perform_create(self, serializer):
        team_id = self.kwargs['pk']
        serializer.save(team_id=team_id)
      
class TeamMeetingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.TeamMeetingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, permissions.IsCreatorOrReadOnly]

    def get_object(self):
        meeting_id = self.kwargs['meeting_id']
        return models.TeamMeeting.objects.get(id=meeting_id)  
        
class SearchView(APIView):
    def get(self, request):
        query = request.GET.get('query')
        if not query:
            return Response([])
        teams = models.Team.objects.filter(name__icontains=query)
        serializer = serializers.TeamSerializer(teams, many=True)
        return Response(serializer.data)