from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    tagline = models.CharField(max_length=225, null=True, blank=True)
    profile = models.CharField(null=True, blank=True) 

class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    follows = models.BooleanField(default=True)
    likes = models.BooleanField(default=True)
    comments = models.BooleanField(default=True)
    meetings = models.BooleanField(default=True)
    system = models.BooleanField(default=True) 

class Team(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    PRIVACY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    name = models.CharField(max_length=255, unique=True)
    profile_image = models.CharField(null=True, blank=True)
    description = models.TextField()
    maximum_members = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='public')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_members')
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('member', 'Member')], default='member')
    request_status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')

class ChatRoom(models.Model):
    ROOM_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('team', 'Team'),
    ]
    room_type = models.CharField(max_length=10, choices=ROOM_TYPE_CHOICES)
    members = models.ManyToManyField(User, related_name='chat_rooms')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True, blank=True, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    file = models.URLField(blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  


@receiver(post_save, sender=User)
def create_or_update_notification_preference(sender, instance, created, **kwargs):
    print(f"create_or_update_notification_preference called for user: {instance}")
    if not NotificationPreference.objects.filter(user=instance).exists():
        print(f"Creating notification preference for user: {instance}")
        NotificationPreference.objects.create(user=instance)
    else:
        print(f"Notification preference already exists for user: {instance}")  