from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = '__all__'

class CommunitySerializer(serializers.ModelSerializer):
    admin_id = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    class Meta:
        model = models.Community
        fields = '__all__'

    def get_member_count(self, obj):
        return models.CommunityMember.objects.filter(community=obj).count()
    
    def get_admin_id(self, obj):
        try:
            community = models.CommunityMember.objects.get(community_id=obj.id, role='admin')
            user = community.user
            return user.id  
        except models.CommunityMember.DoesNotExist:
            return None

class CommunityMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CommunityMember
        fields = ['id', 'role', 'created_at', 'community_id', 'user_id']
        read_only_fields = ['id', 'role', 'created_at', 'community_id', 'user_id']   