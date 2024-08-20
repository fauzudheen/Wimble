from django.db import models
from chat.models import User, Team
from .notification import send_notification


class Article(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=255)
    content = models.TextField()
    thumbnail = models.CharField(null=True, blank=True)

class Like(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')

class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies') 

class Relation(models.Model):
    follower = models.ForeignKey(User, related_name='followings', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('meeting', 'Meeting'),
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('follow', 'Follow'),
        ('system', 'System'),
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    relation = models.ForeignKey(Relation, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    like = models.ForeignKey(Like, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            print("Saving new notification...")
            self.create_notification() 

    def create_notification(self):
        notification_data = {
            'sender': self.sender.id if self.sender else None,
            'receiver': self.receiver.id,
            'notification_type': self.notification_type,
            'team': self.team.id if self.team else None,
            'article': self.article.id if self.article else None,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'is_read': self.is_read
        }
        print("------------------create_notification view called in communication service-----------------")
        send_notification(self.receiver.id, notification_data)