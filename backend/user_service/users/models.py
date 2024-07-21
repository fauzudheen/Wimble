from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime
import json
from .producer import kafka_producer

class User(AbstractUser):
    tagline = models.CharField(max_length=225, null=True, blank=True)
    bio = models.TextField(max_length=1000, null=True, blank=True)
    profile = models.ImageField(upload_to='profiles/', null=True, blank=True)
    account_tier = models.CharField(default="free", max_length=50)
    date_joined = models.DateField(default=datetime.date.today)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-id'] 

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.publish_user_update()

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

class Skill(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

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

    def publish_interest_update(self):
        interest_data = { 
            'id': self.id,
            'name': self.name
        }

        kafka_producer.produce_message('interests', self.id, interest_data)

class UserInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interest = models.ForeignKey(Interest, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'interest')
        ordering = ['-id']

    def __str__(self):
        return f"{self.user.username} - {self.interest.name}"