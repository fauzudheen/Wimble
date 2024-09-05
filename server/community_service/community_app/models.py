from django.db import models

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    tagline = models.CharField(max_length=225, null=True, blank=True)
    profile = models.CharField(null=True, blank=True)

class Community(models.Model):
    name = models.CharField(max_length=255, unique=True)
    profile_image = models.ImageField(upload_to="community_service/community_app/profiles/", blank=True, null=True)
    cover_image = models.ImageField(upload_to="community_service/community_app/covers/", blank=True, null=True) 
    description = models.TextField()
    rules = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

class CommunityMember(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name="members") # Once we call members, 
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="community_members") # we can access rest of the fields in the communityMember model.
    role = models.CharField(max_length=255) # like members__user, members__user_id, members__role, members__created_at, etc
    created_at = models.DateTimeField(auto_now_add=True)
