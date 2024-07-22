from django.urls import path, include
from . import views

urlpatterns = [
    path('articles/', views.ArticleListCreateView.as_view()),
    path('articles/<int:pk>/', views.ArticleRetrieveUpdateDestroyView.as_view()),
    path('articles/<int:pk>/tags/', views.TagListCreateView.as_view()),
    path('article-tags/<int:pk>/', views.TagDestroyView.as_view()),
    path('article-like/', views.LikeView.as_view()),
    path('articles/<int:pk>/comments/', views.CommentListCreateView.as_view()), 
    path('article-comments/<int:pk>/', views.CommentRetrieveUpdateDestroyView.as_view()),
    path('articles/<int:pk>/reports/', views.ReportListCreateView.as_view()),
]
