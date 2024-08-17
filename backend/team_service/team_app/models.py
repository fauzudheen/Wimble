from django.db import models
from .producer import kafka_producer
from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver


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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_team_member_update()

    def delete(self, *args, **kwargs):
        self.publish_team_member_delete()
        super().delete(*args, **kwargs)

    def publish_team_member_update(self):
        team_member_data = {
            'id': self.id,
            'team_id': self.team.id,
            'user_id': self.user.id,
            'role': self.role,
            'request_status': self.request_status
        }

        kafka_producer.produce_message('team-members', self.id, team_member_data)

    def publish_team_member_delete(self):
        team_member_data = {
            'id': self.id
        }
        kafka_producer.produce_message('team-members-deleted', self.id, team_member_data)

class TeamPermission(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='permissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_permissions') 
    can_create_project = models.BooleanField(default=False)
    can_manage_members = models.BooleanField(default=False)
    can_schedule_meetings = models.BooleanField(default=False)
    can_send_messages = models.BooleanField(default=True)

class TeamMeeting(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='meetings')
    title = models.CharField(max_length=255)
    description = models.TextField()
    members = models.ManyToManyField(User, related_name='team_meetings')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_time']

    # In Django, many-to-many relationships are saved after the main model instance is saved, so we need to use the post_save signal.
    def publish_team_meeting_update(self):
        team_meeting_data = {
            'id': self.id,
            'team_id': self.team.id,
            'title': self.title,
            'description': self.description,
            'members': [member.id for member in self.members.all()],
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat()
        }

        kafka_producer.produce_message('team-meetings', self.id, team_meeting_data)
    
    def publish_team_meeting_delete(self):
        team_meeting_data = {
            'id': self.id
        }
        kafka_producer.produce_message('team-meetings-deleted', self.id, team_meeting_data) 

@receiver(post_delete, sender=TeamMeeting)
def team_meeting_post_delete(sender, instance, **kwargs):
    instance.publish_team_meeting_delete()

@receiver(m2m_changed, sender=TeamMeeting.members.through)
def team_meeting_members_changed(sender, instance, action, **kwargs):
    if action == 'post_add':
        instance.publish_team_meeting_update()
