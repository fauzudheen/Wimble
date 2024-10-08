from django.urls import path, include
from . import views
from django.urls import re_path
from django.views.static import serve
from django.conf import settings
from . import views

urlpatterns = [
    path('articles/', views.ArticleView.as_view()),
    path('articles/<int:pk>/', views.ArticleView.as_view()),
    path('feed/', views.FeedView.as_view()),
    path('articles/<int:pk>/tags/', views.TagView.as_view()),
    path('article-tags/<int:pk>/', views.TagView.as_view()),
    path('article-like/', views.LikeView.as_view()), 
    path('articles/<int:article_id>/comments/', views.CommentView.as_view()),
    path('article-comments/<int:pk>/', views.CommentView.as_view()),
    path('articles/<int:pk>/reports/', views.ReportView.as_view()), 
    path('article-reports/', views.ReportView.as_view()),
    path('article-reports/<int:pk>/', views.ReportView.as_view()),
    path('articles/by-tag/<int:pk>/', views.ArticleByTagView.as_view()),
    path('articles/by-community/<int:pk>/', views.ArticleByCommunityView.as_view()),
    path('user-interactions/<int:pk>/', views.UserInteractionView.as_view()), 
    path('article-view/<int:pk>/', views.ArticleViewView.as_view()),
    path('trending-tags/', views.TrendingTagsView.as_view()),
]
