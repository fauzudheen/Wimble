from django.db import models
from producer import kafka_producer

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    tagline = models.CharField(max_length=225, null=True, blank=True)
    profile = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_staff = models.BooleanField(default=False)

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

class Article(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', max_length=200, null=True, blank=True)
    tags = models.ManyToManyField(Interest, related_name='articles') # This is in place of ArticleInterests model, 
    # as ArticleInterests will require seperate form submission

    class Meta:
        ordering = ['-created_at']

class Like(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('article', 'user')
        ordering = ['-created_at']

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class Report(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='reports')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Report by {self.user} on {self.article}'
    
    class Meta:
        ordering = ['-created_at']

