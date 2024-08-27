import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.db.models import Count, Q
from .models import Article, Interest, Tag, ArticleView, UserInterest, Like, Comment

def get_hybrid_recommendations(user_id, num_recommendations=10):
    # Get the user's viewed articles
    user_views = ArticleView.objects.filter(user_id=user_id).values_list('article_id', flat=True)
    
    # Get the user's interests
    user_interests = UserInterest.objects.filter(user_id=user_id).values_list('interest__name', flat=True)
    
    # Get all articles with aggregated interaction data
    articles = Article.objects.annotate(
        view_count=Count('views'),
        like_count=Count('likes'),
        comment_count=Count('comments'),
        user_viewed=Count('views', filter=Q(views__user_id=user_id)),
        user_liked=Count('likes', filter=Q(likes__user_id=user_id)),
        user_commented=Count('comments', filter=Q(comments__user_id=user_id))
    ).prefetch_related('tags__interest')
    
    # Create a DataFrame with article information and interaction data
    df = pd.DataFrame(list(articles.values('id', 'title', 'content', 'view_count', 'like_count', 'comment_count', 'user_viewed', 'user_liked', 'user_commented')))
    
    # Add tags as a comma-separated string
    df['tags'] = df['id'].apply(lambda x: ','.join(Tag.objects.filter(article_id=x).values_list('interest__name', flat=True)))
    
    # Combine title, content, and tags for TF-IDF
    df['text'] = df['title'] + ' ' + df['content'] + ' ' + df['tags']
    
    # Create TF-IDF matrix
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['text'])
    
    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Get indices of user's viewed articles
    viewed_indices = df[df['user_viewed'] > 0].index
    
    # Calculate mean similarity scores for viewed articles
    if len(viewed_indices) > 0:
        user_profile = cosine_sim[viewed_indices].mean(axis=0)
    else:
        user_profile = np.zeros(len(df))
    
    # Calculate content-based score
    df['content_score'] = user_profile
    
    # Calculate interaction score
    df['interaction_score'] = (
        np.log1p(df['view_count']) * 0.3 +
        np.log1p(df['like_count']) * 0.4 +
        np.log1p(df['comment_count']) * 0.3
    )
    
    # Calculate user-specific interaction score
    df['user_interaction_score'] = (
        df['user_viewed'] * 0.3 +
        df['user_liked'] * 0.4 +
        df['user_commented'] * 0.3
    )
    
    # Normalize scores
    def normalize(column):
        return (column - column.min()) / (column.max() - column.min())
    
    df['content_score_norm'] = normalize(df['content_score'])
    df['interaction_score_norm'] = normalize(df['interaction_score'])
    df['user_interaction_score_norm'] = normalize(df['user_interaction_score'])
    
    # Calculate final score
    df['final_score'] = (
        df['content_score_norm'] * 0.4 +
        df['interaction_score_norm'] * 0.4 +
        df['user_interaction_score_norm'] * 0.2
    )
    
    # Boost articles with user's interests
    user_interest_set = set(user_interests)
    df['interest_boost'] = df['tags'].apply(lambda x: len(set(x.split(',')) & user_interest_set) * 0.1)
    df['final_score'] += df['interest_boost']
    
    # Sort by final score and get top recommendations
    recommendations = df.sort_values('final_score', ascending=False).head(num_recommendations)

    # Filter out articles that the user has already viewed
    # recommendations = df[df['user_viewed'] == 0].sort_values('final_score', ascending=False).head(num_recommendations)
    
    return recommendations['id'].tolist()