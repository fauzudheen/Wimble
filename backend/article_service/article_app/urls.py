from django.urls import path, include
from . import views

urlpatterns = [
    path('articles/', views.ArticleListCreateView.as_view()),
    path('articles/<int:pk>/', views.ArticleRetrieveUpdateDestroyView.as_view()),
    path('article-like/', views.LikeView.as_view()),
    path('article-comments/', views.CommentListCreateView.as_view()), 
    #instead of listing all the article comments, list only comments of the current article
    path('article-comments/<int:pk>/', views.CommentRetrieveUpdateDestroyView.as_view()),
]
