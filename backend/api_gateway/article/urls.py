from django.urls import path, include
from . import views
from django.urls import re_path
from django.views.static import serve
from django.conf import settings
from . import views

urlpatterns = [
    path('articles/', views.ArticleView.as_view()),
    path('articles/<int:pk>/', views.ArticleView.as_view()),
    path('articles/<int:pk>/tags/', views.TagView.as_view()),
    path('article-tags/<int:pk>/', views.TagView.as_view()),
    path('article-like/', views.LikeView.as_view()), 
    path('articles/<int:article_id>/comments/', views.CommentView.as_view()),
    path('article-comments/<int:pk>/', views.CommentView.as_view()),
    path('articles/<int:pk>/reports/', views.ReportView.as_view()), 


]
