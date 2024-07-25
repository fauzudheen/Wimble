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
            user = models.CommunityMember.objects.get(community=obj, role='admin').user 
            return user.id  
        except models.CommunityMember.DoesNotExist:
            return None

class CommunityMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CommunityMember
        fields = '__all__'