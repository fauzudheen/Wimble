from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrAdmin, IsOwner, IsOwnerOrReadOnly, IsOwnerOrAdminForArticle
from .models import Article, Like, Comment
from . import serializers, permissions, models
from django.core.cache import cache
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = serializers.ArticleSerializer
    parser_classes = (MultiPartParser, FormParser)
  
class ArticleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = serializers.ArticleSerializer
    permission_classes = [IsOwnerOrAdminForArticle]

class TagListCreateView(generics.ListCreateAPIView):
    queryset = models.Tag.objects.all()
    serializer_class = serializers.TagSerializer

    def create(self, request, *args, **kwargs):
        article_id = self.kwargs.get('pk')
        interest_ids = request.data.get('interest_ids', [])
        tags = []
        for interest_id in interest_ids:
            tag = models.Tag.objects.create(
                article_id=article_id,
                interest_id=interest_id
            )
            tags.append(tag)
        
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)  
    
class TagDestroyView(generics.DestroyAPIView):
    queryset = models.Tag.objects.all()
    serializer_class = serializers.TagSerializer

    def delete(self, request, *args, **kwargs):
        interest_ids = request.data.get('interest_ids', [])
        models.Tag.objects.filter(interest_id__in=interest_ids).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LikeView(generics.GenericAPIView):
    serializer_class = serializers.LikeSerializer
    permission_classes = [IsAuthenticated] 

    def post(self, request):
        article_id = request.data.get('article_id')
        if not article_id:
            return Response({'error': 'article_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        article = generics.get_object_or_404(Article, id=article_id)
        like, created = Like.objects.get_or_create(article=article, user_id=request.user.id)
        
        if created: 
            return Response({'message': 'Article liked successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'You have already liked this article'}, status=status.HTTP_200_OK)

    def delete(self, request):
        article_id = request.query_params.get('article_id')
        if not article_id:
            return Response({'error': 'article_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        like = Like.objects.filter(article_id=article_id, user_id=request.user.id).first()
        if like:
            like.delete()
            return Response({'message': 'Like removed successfully'})
        else:
            return Response({'message': 'You have not liked this article'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        article_id = request.query_params.get('article_id')
        if not article_id:
            return Response({'error': 'article_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        like = Like.objects.filter(article_id=article_id, user_id=request.user.id).exists()
        return Response({'liked': like}, status=status.HTTP_200_OK)




class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        article_id = self.kwargs['pk']
        return Comment.objects.filter(article_id=article_id)
    
    def perform_create(self, serializer):
        article_id = self.kwargs.get('pk')
        serializer.save(user_id=self.request.user.id, article_id=article_id)

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin] 

class ReportListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.ReportSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        article_id = self.kwargs['pk']
        return models.Report.objects.filter(article_id=article_id) 
    
    def perform_create(self, serializer):
        article_id = self.kwargs.get('pk')
        serializer.save(user_id=self.request.user.id, article_id=article_id)

class ArticleByTagView(generics.ListAPIView):
    serializer_class = serializers.ArticleSerializer

    def get_queryset(self):
        print("-----------------get_queryset---------------", self.kwargs)
        interest_id = self.kwargs['pk']
        return Article.objects.filter(tags__interest_id=interest_id)
    
class UserInteractionsView(APIView):

    def get(self, request, pk):
        user = models.User.objects.get(id=pk)

        articles = Article.objects.filter(author_id=user.id)
        likes = Like.objects.filter(user_id=user.id)
        comments = Comment.objects.filter(user_id=user.id)

        articles_serializer = serializers.ArticleSerializer(articles, many=True)
        likes_serializer = serializers.LikeSerializer(likes, many=True)
        comments_serializer = serializers.CommentSerializer(comments, many=True)

        return Response({
            'articles': articles_serializer.data,
            'likes': likes_serializer.data,
            'comments': comments_serializer.data
        }, status=status.HTTP_200_OK)