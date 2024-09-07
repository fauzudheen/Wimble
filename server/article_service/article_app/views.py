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
from rest_framework.pagination import PageNumberPagination
from .recommendations import get_hybrid_recommendations
from django.db.models import Case, When
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta


class CustomPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100 

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.filter(is_flagged=False, is_toxic=False)  
    serializer_class = serializers.ArticleSerializer
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = CustomPagination
  
class ArticleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = serializers.ArticleSerializer
    permission_classes = [IsOwnerOrAdminForArticle]  

class FeedView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    def get(self, request):
        user_id = request.user.id
        recommended_article_ids = get_hybrid_recommendations(user_id)

        # Preserve the order of recommendations
        preserved_order = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(recommended_article_ids)])
        recommended_articles = Article.objects.filter(is_flagged=False, is_toxic=False, id__in=recommended_article_ids).order_by(preserved_order)
  
        paginator = self.pagination_class()
        paginated_articles = paginator.paginate_queryset(recommended_articles, request)
        serializer = serializers.ArticleSerializer(paginated_articles, many=True)
        return paginator.get_paginated_response(serializer.data) 


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
        parent_id = self.request.data.get('parent_id', None) 
        serializer.save(user_id=self.request.user.id, article_id=article_id, parent_id=parent_id)

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin] 

class ReportListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        article_id = self.kwargs['pk']
        return models.Report.objects.filter(article_id=article_id) 
    
    def perform_create(self, serializer):
        article_id = self.kwargs.get('pk')
        serializer.save(user_id=self.request.user.id, article_id=article_id)

class ReportListView(generics.ListAPIView):
    serializer_class = serializers.ReportSerializer
    permission_classes = [IsAdminUser] 
    queryset = models.Report.objects.all()

class ReportDestroyView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        article_id = self.kwargs.get('pk')
        reports = models.Report.objects.filter(article_id=article_id)
        reports_count = reports.count()
        
        if reports_count == 0:
            return Response({"message": "No reports found for this article."}, status=status.HTTP_404_NOT_FOUND)
        
        reports.delete()
        return Response({"message": f"{reports_count} reports deleted."}, status=status.HTTP_204_NO_CONTENT)
    
class ArticleByTagView(generics.ListAPIView):
    serializer_class = serializers.ArticleSerializer

    def get_queryset(self):
        print("-----------------get_queryset---------------", self.kwargs)
        interest_id = self.kwargs['pk']
        return Article.objects.filter(tags__interest_id=interest_id, is_flagged=False, is_toxic=False)
    
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
    
class ArticleByCommunityView(generics.ListAPIView):
    serializer_class = serializers.ArticleSerializer

    def get_queryset(self):
        community_id = self.kwargs['pk']
        return Article.objects.filter(community_id=community_id) 
    
class SearchView(APIView):
    def get(self, request):
        query = request.GET.get('query')
        if not query:
            return Response({"error": "No such search query provided"}, status=status.HTTP_400_BAD_REQUEST)
        articles = Article.objects.filter(title__icontains=query, is_flagged=False) 
        serializer = serializers.ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ArticleViewListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.ArticleViewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        article_id = self.kwargs['pk']
        return models.ArticleView.objects.filter(article_id=article_id, user_id=self.request.user.id) 
    
    def perform_create(self, serializer):
        article_id = self.kwargs.get('pk')
        serializer.save(user_id=self.request.user.id, article_id=article_id)

class FetchAllArticlesView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        articles = Article.objects.all()
        serializer = serializers.ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TrendingTagsView(APIView):
    def get(self, request):
        one_week_ago = timezone.now() - timedelta(days=7)

        trending_interests = models.Interest.objects.filter(
            tagged_articles__article__created_at__gte=one_week_ago
        ).annotate(
            count=Count('tagged_articles')
        ).order_by('-count')[:5]

        serializer = serializers.InterestSerializer(trending_interests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
