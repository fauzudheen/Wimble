import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.db.models import Count, Q
from .models import Article, Interest, Tag, ArticleView, UserInterest, Like, Comment, User
from bs4 import BeautifulSoup
import re
import nltk
from nltk.corpus import stopwords


def clean_html(raw_html):
    # Remove HTML tags using Python's built-in HTML parser
    cleantext = BeautifulSoup(raw_html, "html.parser").get_text()
    # Remove extra whitespace
    cleantext = re.sub(r'\s+', ' ', cleantext).strip()
    return cleantext

def clean_text(text):
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Convert to lowercase
    text = text.lower()
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    word_tokens = text.split()
    filtered_text = [word for word in word_tokens if word not in stop_words]
    return ' '.join(filtered_text)

def get_hybrid_recommendations(user_id, num_recommendations=10):
    user = User.objects.get(id=user_id)
    
    # Get user's interests
    user_interests = UserInterest.objects.filter(user=user).values_list('interest__name', flat=True)
    
    # Get user's viewed, liked, and commented articles
    viewed_articles = ArticleView.objects.filter(user=user).values_list('article_id', flat=True)
    liked_articles = Like.objects.filter(user=user).values_list('article_id', flat=True)
    commented_articles = Comment.objects.filter(user=user).values_list('article_id', flat=True)
    
    # Combine and get unique article IDs
    interacted_articles = set(viewed_articles) | set(liked_articles) | set(commented_articles)
    
    # Get all articles
    articles = Article.objects.annotate(
        view_count=Count('views'),
        like_count=Count('likes'),
        comment_count=Count('comments')
    ).prefetch_related('tags__interest')
    
    # Create a DataFrame with article information
    df = pd.DataFrame(list(articles.values('id', 'title', 'content', 'view_count', 'like_count', 'comment_count')))
    
    # Clean title and content
    df['title_clean'] = df['title'].apply(clean_html).apply(clean_text)
    df['content_clean'] = df['content'].apply(clean_html).apply(clean_text)
    
    # Add tags as a comma-separated string
    df['tags'] = df['id'].apply(lambda x: ' '.join(Tag.objects.filter(article_id=x).values_list('interest__name', flat=True)))
    df['tags_clean'] = df['tags'].apply(clean_text)
    
    # Combine cleaned title, cleaned content, and cleaned tags for TF-IDF
    df['text'] = df['title_clean'] + ' ' + df['content_clean'] + ' ' + df['tags_clean']
    
    # Create TF-IDF matrix
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(df['text'])
    
    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Calculate content-based score
    user_profile = np.zeros(len(df))
    if interacted_articles:
        interacted_indices = df[df['id'].isin(interacted_articles)].index
        user_profile = cosine_sim[interacted_indices].mean(axis=0)
    
    df['content_score'] = user_profile
    
    # Calculate interaction score
    df['interaction_score'] = (
        np.log1p(df['view_count']) * 0.3 +
        np.log1p(df['like_count']) * 0.4 +
        np.log1p(df['comment_count']) * 0.3
    )
    
    # Calculate interest match score
    df['interest_match'] = df['tags'].apply(lambda x: len(set(x.split()) & set(user_interests)))
    
    # Normalize scores
    def normalize(column):
        return (column - column.min()) / (column.max() - column.min() + 1e-10)
    
    df['content_score_norm'] = normalize(df['content_score'])
    df['interaction_score_norm'] = normalize(df['interaction_score'])
    df['interest_match_norm'] = normalize(df['interest_match'])
    
    # Calculate final score
    df['final_score'] = (
        df['content_score_norm'] * 0.4 +
        df['interaction_score_norm'] * 0.3 +
        df['interest_match_norm'] * 0.3
    )
    
    # Sort by final score and get top recommendations
    recommendations = df.sort_values('final_score', ascending=False)
    
    # Remove articles the user has already interacted with
    # recommendations = recommendations[~recommendations['id'].isin(interacted_articles)]
    
    return recommendations['id'].head(num_recommendations).tolist()