from django.db import models
from .producer import kafka_producer

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    tagline = models.CharField(max_length=225, null=True, blank=True)
    profile = models.CharField(null=True, blank=True)
    is_staff = models.BooleanField(default=False)

class Article(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='article_service/article_app/thumbnails/', max_length=200, null=True, blank=True)
    community_id = models.IntegerField(null=True, blank=True)
    

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_article_update()

    def delete(self, *args, **kwargs):
        self.publish_article_delete()
        super().delete(*args, **kwargs)

    def publish_article_update(self):
        article_data = {
            'id': self.id,
            'author_id': self.author.id,
            'title': self.title,
            'content': self.content, 
            'thumbnail': self.thumbnail.url if self.thumbnail else None,
        }
        kafka_producer.produce_message('articles', self.id, article_data)

    def publish_article_delete(self):
        article_data = {
            'id': self.id,
        }
        kafka_producer.produce_message('articles-deleted', self.id, article_data)

class Interest(models.Model):
    name = models.CharField(max_length=50, unique=True) 

    def __str__(self):
        return self.name
    
    def publish_interest_update(self):
        interest_data = {
            'id': self.id,
            'name': self.name
        }
        kafka_producer.produce_message('article_interests', self.id, interest_data)

    def save(self, *args, **kwargs):
        if not self.pk:  # Only publish if this is a new record
            super().save(*args, **kwargs)
            self.publish_interest_update()
        else:
            super().save(*args, **kwargs)

class Tag(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='tags')
    interest = models.ForeignKey(Interest, on_delete=models.CASCADE, related_name='tagged_articles')

    class Meta:
        unique_together = ('article', 'interest')

    def __str__(self):
        return f'{self.article} tagged with {self.interest}'

class Like(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('article', 'user')
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_like_update()

    def delete(self, *args, **kwargs):
        self.publish_like_delete()
        super().delete(*args, **kwargs)

    def publish_like_update(self):
        like_data = {
            'id': self.id,
            'article_id': self.article.id,
            'user_id': self.user.id
        }
        kafka_producer.produce_message('likes', self.id, like_data)

    def publish_like_delete(self):
        like_data = {
            'id': self.id,
        }   
        kafka_producer.produce_message('likes-deleted', self.id, like_data)


class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_comment_update()

    def delete(self, *args, **kwargs):
        self.publish_comment_delete()
        super().delete(*args, **kwargs)

    def publish_comment_update(self):
        comment_data = {
            'id': self.id,
            'article_id': self.article.id,
            'user_id': self.user.id,
            'text': self.text,
            'parent_id': self.parent.id if self.parent else None
        }
        kafka_producer.produce_message('comments', self.id, comment_data)

    def publish_comment_delete(self):
        comment_data = {
            'id': self.id,
        }
        kafka_producer.produce_message('comments-deleted', self.id, comment_data)

class Report(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='reports')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Report by {self.user} on {self.article}'
    
    class Meta:
        ordering = ['-created_at']

