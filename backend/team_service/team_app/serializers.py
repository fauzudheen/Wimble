from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    class Meta:
        model = models.Team
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'admin']
    
    def get_member_count(self, obj):
        return obj.members.count()
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        return obj.members.filter(user_id=request.user.id).exists()

    
class TeamMemberSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField()
    class Meta:
        model = models.TeamMember
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'team', 'user', 'user_data']

    def get_user_data(self, obj):
        return {
            'id': obj.user.id,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'tagline': obj.user.tagline,
            'profile': obj.user.profile.url if obj.user.profile else None
        }

class TeamPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamPermission
        fields = '__all__' 
        read_only_fields = ['id', 'created_at', 'team']
