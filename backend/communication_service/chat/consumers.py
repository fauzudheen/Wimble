import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message, User, Team

class BaseChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '')
        user_id = data['user_id']
        file_name = data.get('file_name', None)
        file_type = data.get('file_type', None)
        
        # Save the message to the database
        await self.save_message(user_id, message, file_name, file_type)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': user_id,
                'file_name': file_name,
                'file_type': file_type
            }
        )

    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        file_name = event.get('file_name')
        file_type = event.get('file_type')

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user_id': user_id,
            'file_name': file_name,
            'file_type': file_type
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

class TeamChatConsumer(BaseChatConsumer):
    async def connect(self):
        self.team_id = self.scope['url_route']['kwargs']['team_id']
        self.room = await self.get_or_create_team_room()
        self.room_id = self.room.id
        self.room_group_name = f'chat_team_{self.team_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await super().connect()

    @database_sync_to_async
    def get_or_create_team_room(self):
        team = Team.objects.get(id=self.team_id)
        room, _ = ChatRoom.objects.get_or_create(
            team=team,
            room_type='team'
        )
        return room

class IndividualChatConsumer(BaseChatConsumer):
    async def connect(self):
        self.user1_id = self.scope['url_route']['kwargs']['user1_id']
        self.user2_id = self.scope['url_route']['kwargs']['user2_id']
        self.room = await self.get_or_create_individual_room()
        self.room_id = self.room.id
        self.room_group_name = f'chat_individual_{self.room_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

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
