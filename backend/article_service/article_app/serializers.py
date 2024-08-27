from rest_framework import serializers
from .models import Article, User, Like, Comment
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    interest_ids = serializers.ListField(write_only=True)
    interest_name = serializers.SerializerMethodField()
    class Meta:
        model = models.Tag
        fields = ["id", "interest", "interest_name", "interest_ids"]

    def get_interest_name(self, obj):
        return obj.interest.name
    
    

class ArticleSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, required=False) 
    
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
    article = serializers.SerializerMethodField()
    class Meta:
        model = Like
        fields = "__all__"
        read_only_fields = ['id', 'user', 'created_at', 'article'] 
    
    def create(self, validated_data):
        user = self.context['request'].user
        article_id = self.context['request'].data.get('article_id')
        article = Article.objects.get(id=article_id)
        return Like.objects.create(user=user, article=article)

    def get_article(self, obj):
        return ArticleSerializer(obj.article).data

class CommentSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    article = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ['id', 'text', 'created_at', 'user_data', 'parent', 'replies', 'article']
        read_only_fields = ['id', 'user', 'created_at', 'parent', 'article']   

    def get_user_data(self, obj):
        return UserSerializer(obj.user).data 
    
    def get_replies(self, obj):
        replies = Comment.objects.filter(parent=obj)
        return CommentSerializer(replies, many=True).data
    
    def get_article(self, obj):
        return ArticleSerializer(obj.article).data
    
class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Report 
        fields = '__all__'
        read_only_fields = ['id', 'user', 'article','created_at']

class ArticleViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ArticleView
        fields = '__all__'
        read_only_fields = ['id', 'user', 'article','created_at']