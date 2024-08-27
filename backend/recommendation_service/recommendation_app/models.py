from django.db import models

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    tagline = models.CharField(max_length=225, null=True, blank=True)
    profile = models.CharField(null=True, blank=True)
    bio = models.TextField(max_length=1000, null=True, blank=True)

class Article(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=255)
    content = models.TextField()
    thumbnail = models.CharField(null=True, blank=True)
    community_id = models.IntegerField(null=True, blank=True)

class Interest(models.Model):
    name = models.CharField(max_length=50, unique=True) 

class Tag(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='tags')
    interest = models.ForeignKey(Interest, on_delete=models.CASCADE, related_name='tagged_articles')

class Like(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
