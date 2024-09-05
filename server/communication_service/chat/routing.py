from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/teams/(?P<team_id>\d+)/$', consumers.TeamChatConsumer.as_asgi()),
    re_path(r'ws/chat/individual/(?P<user1_id>\d+)/(?P<user2_id>\d+)/$', consumers.IndividualChatConsumer.as_asgi()),
]