from django.db import models

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    tagline = models.CharField(max_length=225, null=True, blank=True)
    profile = models.ImageField(upload_to='user_profiles/', null=True, blank=True)

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
    profile_image = models.ImageField(upload_to="team_profiles/", blank=True, null=True)
    description = models.TextField()
    maximum_members = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='public')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

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
    FILE_TYPE_CHOICES = [
        ('image', 'Image'),
        ('audio', 'Audio'),
        ('video', 'Video'),
        ('document', 'Document')
    ]
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    file = models.FileField(upload_to='chat_files/', null=True, blank=True)
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  

