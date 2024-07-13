from rest_framework import serializers
from .models import Article, User, Like, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class ArticleSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    class Meta:
        model = Article
        fields = "__all__"

    def get_user_data(self, obj):
        user_data = User.objects.get(id=obj.author_id)
        return UserSerializer(user_data).data
    
    def get_likes_count(self, obj):
        return Like.objects.filter(article_id=obj.id).count()
    
    def get_comments_count(self, obj):
        return Comment.objects.filter(article_id=obj.id).count()
    
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        article_id = self.context['request'].data.get('article_id')
        article = Article.objects.get(id=article_id)
        return Like.objects.create(user=user, article=article)

class CommentSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ['id', 'text', 'created_at', 'user_data']
        read_only_fields = ['id', 'user', 'created_at']

    def get_user_data(self, obj):
        return UserSerializer(obj.user).data 