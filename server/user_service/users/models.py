from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime
import json
from .producer import kafka_producer
from django_prometheus.models import ExportModelOperationsMixin

class User(AbstractUser):
    tagline = models.CharField(max_length=225, null=True, blank=True)
    email = models.EmailField(max_length=255, unique=True)
    bio = models.TextField(max_length=1000, null=True, blank=True)
    profile = models.ImageField(upload_to='user_service/users/profiles/', null=True, blank=True)
    account_tier = models.CharField(default="free", max_length=50)
    date_joined = models.DateField(default=datetime.date.today)
    is_active = models.BooleanField(default=True)
    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_subscription_id = models.CharField(max_length=255, null=True, blank=True)
    subscription_expiry = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-id'] 

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_user_update()

    def delete(self, *args, **kwargs):
        self.publish_user_delete()
        super().delete(*args, **kwargs)

    def publish_user_update(self):
        user_data = { 
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'is_active': self.is_active,
            'is_staff': self.is_staff,
            'tagline': self.tagline, 
            'bio': self.bio,
            'profile': self.profile.url if self.profile else None,  # Convert to URL
            'account_tier': self.account_tier,
            'date_joined': str(self.date_joined),
        }

        kafka_producer.produce_message('users', self.id, user_data)

    def publish_user_delete(self):
        user_data = { 
            'id': self.id
        }
        kafka_producer.produce_message('users-deleted', self.id, user_data)

class Skill(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class UserSkill(ExportModelOperationsMixin('UserSkill'), models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="skills")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="users")

    class Meta:
        unique_together = ('user', 'skill')
        ordering = ['-id']

    def __str__(self):
        return f"{self.user.username} - {self.skill.name}"

    
class Interest(models.Model):
    name = models.CharField(max_length=50, unique=True) 

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name'] 

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_interest_update()

    def delete(self, *args, **kwargs):
        self.publish_interest_delete()
        super().delete(*args, **kwargs)

    def publish_interest_update(self):
        interest_data = { 
            'id': self.id,
            'name': self.name
        }

        kafka_producer.produce_message('interests', self.id, interest_data)

    def publish_interest_delete(self):
        interest_data = { 
            'id': self.id
        }
        kafka_producer.produce_message('interests-deleted', self.id, interest_data)

class UserInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interest = models.ForeignKey(Interest, on_delete=models.CASCADE)
    # The UserInterest model doesn't have an explicit related name, which means Django will 
    # create a default one. In the suggestion algorithm, we're using user.userinterest_set to access a user's interests.
    class Meta:
        unique_together = ('user', 'interest')
        ordering = ['interest__name']

    def __str__(self):
        return f"{self.user.username} - {self.interest.name}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_user_interest_update()

    def delete(self, *args, **kwargs):
        self.publish_user_interest_delete()
        super().delete(*args, **kwargs)

    def publish_user_interest_update(self):
        user_interest_data = { 
            'id': self.id,
            'user_id': self.user.id,
            'interest_id': self.interest.id
        }

        kafka_producer.produce_message('user-interests', self.id, user_interest_data)

    def publish_user_interest_delete(self):
        user_interest_data = { 
            'id': self.id
        }
        kafka_producer.produce_message('user-interests-deleted', self.id, user_interest_data)

class Relation(models.Model):
    follower = models.ForeignKey(User, related_name='followings', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')
        indexes = [
            models.Index(fields=['follower', 'following']),
        ]
    
    def __str__(self):
        return f"{self.follower} follows {self.following}"
    
    def delete(self, *args, **kwargs):
        self.publish_relation_delete()
        super().delete(*args, **kwargs)

    def publish_relation_delete(self):
        relation_data = {
            'id': self.id
        }

        kafka_producer.produce_message('relations-deleted', self.id, relation_data)

class Report(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    reportee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_reported')    
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)