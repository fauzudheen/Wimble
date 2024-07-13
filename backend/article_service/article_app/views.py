from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .permissions import IsOwnerOrAdmin, IsOwner, IsOwnerOrReadOnly
from .models import Article, Like, Comment
from .serializers import ArticleSerializer, LikeSerializer, CommentSerializer
from django.core.cache import cache

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
  
class ArticleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    # permission_classes = [IsOwnerOrAdmin]

class LikeView(generics.GenericAPIView):
    serializer_class = LikeSerializer
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
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        article_id = self.kwargs['pk']
        return Comment.objects.filter(article_id=article_id)
    
    def perform_create(self, serializer):
        article_id = self.kwargs.get('pk')
        serializer.save(user_id=self.request.user.id, article_id=article_id)

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin] 

class ArticleCommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        article_id = self.kwargs['pk']
        return Comment.objects.filter(article_id=article_id)
    
