from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from . import permissions, serializers, models
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView


class CommunityListCreateView(generics.ListCreateAPIView):
    queryset = models.Community.objects.all()
    serializer_class = serializers.CommunitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, permissions.IsOwnerOrReadOnly] 
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        community = serializer.save()
        models.CommunityMember.objects.create(community=community,user_id=self.request.user.id,role='admin')

class CommunityRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Community.objects.all()
    serializer_class = serializers.CommunitySerializer
    permission_classes = [permissions.IsOwnerOrReadOnly]

class CommunityMemberListCreateView(generics.ListCreateAPIView):
    queryset = models.CommunityMember.objects.all()
    serializer_class = serializers.CommunityMemberSerializer
    permission_classes = [permissions.IsCommunityAdmin]

    def perform_create(self, serializer):
        pk = self.kwargs['pk']
        serializer.save(community_id=pk, user_id=self.request.user.id, role='user')

    def get_queryset(self):
        pk = self.kwargs['pk']
        return models.CommunityMember.objects.filter(community_id=pk)

class CommunityMemberDestroyView(generics.DestroyAPIView):
    queryset = models.CommunityMember.objects.all()
    serializer_class = serializers.CommunityMemberSerializer
    permission_classes = [permissions.IsCommunityAdmin]

    def perform_destroy(self):
        pk = self.kwargs['pk']
        user_id = self.kwargs['user_id']
        models.CommunityMember.objects.filter(community_id=pk, user_id=user_id).delete()

class MemberCommunityListView(generics.ListAPIView):
    serializer_class = serializers.CommunitySerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return models.Community.objects.filter(members__user_id=user_id)
