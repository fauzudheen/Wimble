from rest_framework import serializers

from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = "__all__"

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Team
        fields = "__all__"

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True, required=False)
    class Meta:
        model = models.Notification
        fields = "__all__"  
