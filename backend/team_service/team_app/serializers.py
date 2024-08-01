from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    is_member = serializers.SerializerMethodField()
    class Meta:
        model = models.Team
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'admin']
    
    def get_is_member(self, obj):
        user_id = self.context['request'].user.id
        print("-----------------Team service get_is_member called-----------------user_id", user_id)
        return obj.members.filter(user_id=user_id).exists()  

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
