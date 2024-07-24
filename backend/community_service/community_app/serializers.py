from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = '__all__'
        
class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Community
        fields = '__all__'

class CommunityMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CommunityMember
        fields = '__all__'