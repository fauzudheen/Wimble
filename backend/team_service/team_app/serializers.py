from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Team
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'admin']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamMember
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'team', 'user']

class TeamPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamPermission
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'team']
