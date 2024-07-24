from django.db import models

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    tagline = models.CharField(max_length=225, null=True, blank=True)
    profile = models.ImageField(upload_to='user_profiles/', null=True, blank=True)

class Community(models.Model):
    name = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to="community_profiles/", blank=True, null=True)
    cover_image = models.ImageField(upload_to="community_covers/", blank=True, null=True) 
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class CommunityMember(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="community_members")
    role = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
