import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message, User, Team, TeamMember
from django.core.exceptions import PermissionDenied

class BaseChatConsumer(AsyncWebsocketConsumer):
    connected_users = set()
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]
        
        # Check if the user has permission to join this chat
        if not await self.user_can_access_chat():
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        self.connected_users.add(self.user.id)
        await self.broadcast_user_count()
        await self.accept()

    async def disconnect(self, close_code):
        self.connected_users.discard(self.user.id)
        await self.broadcast_user_count()
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '')
        file_name = data.get('file_name', None)
        file_type = data.get('file_type', None)
        
        # Save the message to the database
        await self.save_message(self.user.id, message, file_name, file_type)

        # Get sender data
        sender_data = await self.get_sender_data(self.user.id)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': self.user.id,
                'file_name': file_name,
                'file_type': file_type,
                'user_profile': sender_data['profile'],
                'user_first_name': sender_data['first_name'],
                'user_last_name': sender_data['last_name']
            }
        )

    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        file_name = event.get('file_name')
        file_type = event.get('file_type')
        user_profile = event.get('user_profile')
        user_first_name = event.get('user_first_name')
        user_last_name = event.get('user_last_name')

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user_id': user_id,
            'file_name': file_name,
            'file_type': file_type,
            'user_profile': user_profile,
            'user_first_name': user_first_name,
            'user_last_name': user_last_name
        }))

    @database_sync_to_async
    def save_message(self, user_id, message, file_name, file_type):
        user = User.objects.get(id=user_id)
        chat_room = ChatRoom.objects.get(id=self.room_id)
        Message.objects.create(
            room=chat_room,
            sender=user,
            content=message,
            file=file_name,
            file_type=file_type
        )

    @database_sync_to_async
    def get_sender_data(self, user_id):
        user = User.objects.get(id=user_id)
        return {
            'profile': user.profile.url if user.profile else None,
            'first_name': user.first_name,
            'last_name': user.last_name
        }

    @database_sync_to_async
    def user_can_access_chat(self):
        # This method should be implemented in subclasses
        raise NotImplementedError("Subclasses must implement this method")

    async def broadcast_user_count(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_count',
                'count': len(self.connected_users)
            }
        )

    async def user_count(self, event):
        count = event['count']
        await self.send(text_data=json.dumps({
            'type': 'user_count',
            'count': count
        }))

class TeamChatConsumer(BaseChatConsumer):
    async def connect(self):
        self.team_id = self.scope['url_route']['kwargs']['team_id']
        self.room = await self.get_or_create_team_room()
        self.room_id = self.room.id
        self.room_group_name = f'chat_team_{self.team_id}'

        await super().connect()

    @database_sync_to_async
    def get_or_create_team_room(self):
        team = Team.objects.get(id=self.team_id)
        room, _ = ChatRoom.objects.get_or_create(
            team=team,
            room_type='team'
        )
        return room

    @database_sync_to_async
    def user_can_access_chat(self):
        try:
            member = TeamMember.objects.get(team_id=self.team_id, user_id=self.user.id)
            return member.request_status == 'accepted'
        except TeamMember.DoesNotExist:
            return False 


class IndividualChatConsumer(BaseChatConsumer):
    async def connect(self):
        self.user1_id = self.scope['url_route']['kwargs']['user1_id']
        self.user2_id = self.scope['url_route']['kwargs']['user2_id']
        self.room = await self.get_or_create_individual_room()
        self.room_id = self.room.id
        self.room_group_name = f'chat_individual_{self.room_id}'

        await super().connect()

    @database_sync_to_async
    def get_or_create_individual_room(self):
        user1 = User.objects.get(id=self.user1_id)
        user2 = User.objects.get(id=self.user2_id)
        room, _ = ChatRoom.objects.get_or_create(
            room_type='individual'
        )
        room.members.add(user1, user2)
        return room

    @database_sync_to_async
    def user_can_access_chat(self):
        return str(self.user.id) in [self.user1_id, self.user2_id]