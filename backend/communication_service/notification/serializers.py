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

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Article
        fields = "__all__"

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Like
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comment
        fields = "__all__"

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True, required=False)
    article = ArticleSerializer(read_only=True, required=False)
    like = LikeSerializer(read_only=True, required=False)
    comment = CommentSerializer(read_only=True, required=False)
    class Meta:
        model = models.Notification
        fields = "__all__"  
