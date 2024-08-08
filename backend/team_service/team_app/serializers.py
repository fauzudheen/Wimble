from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    request_status = serializers.SerializerMethodField()
    admin_data = serializers.SerializerMethodField()
    class Meta:
        model = models.Team
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'admin']
    
    def get_member_count(self, obj):
        return obj.members.filter(request_status="accepted").count()  
    
    def get_request_status(self, obj):
        request = self.context.get('request')
        member = obj.members.filter(user_id=request.user.id).first()
        if member:
            return member.request_status
        return None
    
    def get_admin_data(self, obj):
        admin = obj.members.filter(role='admin').first()
        if admin:
            return {
                'id': admin.user.id,
                'first_name': admin.user.first_name,
                'last_name': admin.user.last_name,
                'tagline': admin.user.tagline,
                'profile': admin.user.profile.url if admin.user.profile else None
            }
        return None
        


    
class TeamMemberSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField()
    class Meta:
        model = models.TeamMember
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'team', 'user', 'user_data'] 

    def get_user_data(self, obj):
        return {
            'id': obj.user.id,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'tagline': obj.user.tagline,
            'profile': obj.user.profile.url if obj.user.profile else None
        }

class TeamPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamPermission
        fields = '__all__' 
        read_only_fields = ['id', 'created_at', 'team']

class TeamMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamMeeting
        fields = '__all__' 
        read_only_fields = ['id', 'created_at', 'team']
