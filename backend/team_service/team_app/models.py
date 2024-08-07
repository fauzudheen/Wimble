from django.db import models
from .producer import kafka_producer

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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_team_update()

    def delete(self, *args, **kwargs):
        self.publish_team_delete()
        super().delete(*args, **kwargs)

    def publish_team_update(self):
        team_data = {
            'id': self.id,
            'name': self.name,
            'profile_image': self.profile_image.url if self.profile_image else None,
            'description': self.description,
            'maximum_members': self.maximum_members,
            'status': self.status,
            'privacy': self.privacy
        }

        kafka_producer.produce_message('teams', self.id, team_data)

    def publish_team_delete(self):
        team_data = {
            'id': self.id
        }
        kafka_producer.produce_message('teams-deleted', self.id, team_data)


class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_members')
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('member', 'Member')], default='member')
    request_status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class TeamPermission(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='permissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_permissions') 
    can_create_project = models.BooleanField(default=False)
    can_manage_members = models.BooleanField(default=False)
    can_schedule_meetings = models.BooleanField(default=False)
    can_send_messages = models.BooleanField(default=True)
