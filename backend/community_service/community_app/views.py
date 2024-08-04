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
    max_page_size = 100

class CommunityListCreateView(generics.ListCreateAPIView):
    queryset = models.Community.objects.all()
    serializer_class = serializers.CommunitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, permissions.IsOwnerOrReadOnly] 
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = CustomPagination 

    def perform_create(self, serializer):
        try:
            community = serializer.save()
            models.CommunityMember.objects.create(community=community, user_id=self.request.user.id, role='admin')
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CommunityRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Community.objects.all()
    serializer_class = serializers.CommunitySerializer
    permission_classes = [permissions.IsOwnerOrReadOnly]

class CommunityMemberListCreateView(generics.ListCreateAPIView):
    queryset = models.CommunityMember.objects.all()
    serializer_class = serializers.CommunityMemberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        pk = self.kwargs['pk']
        serializer.save(community_id=pk, user_id=self.request.user.id, role='user') 

    def get_queryset(self):
        pk = self.kwargs['pk']
        return models.CommunityMember.objects.filter(community_id=pk)

class CommunityMemberRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = models.CommunityMember.objects.all()
    serializer_class = serializers.CommunityMemberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        pk = self.kwargs['pk']
        user_id = self.kwargs['user_id']
        try:
            return models.CommunityMember.objects.get(community_id=pk, user_id=user_id)
        except models.CommunityMember.DoesNotExist:
            raise NotFound('Community member not found')

    def get(self, request, *args, **kwargs):
        print("-------------get self.kwargs-------------", self.kwargs)
        is_member = self.get_object() is not None
        return Response({'isMember': is_member}, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        print("-------------perform_destroy self.kwargs-------------", self.kwargs)
        pk = self.kwargs['pk']
        user_id = self.kwargs['user_id']

        if instance.role == 'admin':
            other_members = models.CommunityMember.objects.filter(community_id=pk).exclude(user_id=user_id)

            if other_members.exists():
                new_admin = other_members.order_by('created_at').first()
                new_admin.role = 'admin'
                new_admin.save()
            else:
                community = models.Community.objects.get(id=pk)
                community.delete()

        instance.delete()

class MemberCommunityListView(generics.ListAPIView):
    serializer_class = serializers.CommunitySerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return models.Community.objects.filter(members__user_id=user_id) 
    
class MemberAdminedCommunityListView(generics.ListAPIView):
    serializer_class = serializers.CommunitySerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return models.Community.objects.filter(members__user_id=user_id, members__role='admin')
