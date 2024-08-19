import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import User, Team

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_authenticated:
            self.user_id = self.scope["user"].id
            self.group_name = f'notifications_{self.user_id}'
            
            print(f"User {self.user_id} connected to WebSocket")
            print(f"Adding user to group: {self.group_name}")

            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )

            await self.accept()
            print(f"WebSocket connection accepted for user {self.user_id}")
        else:
            print("Unauthenticated user attempted to connect. Closing connection.")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            print(f"User {self.user_id} disconnected from WebSocket")
            print(f"Removing user from group: {self.group_name}")
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def send_notification(self, event):
        notification_data = json.loads(event['notification'])

        sender_data = await self.get_sender_data(notification_data['sender']) if notification_data['sender'] else None
        team_data = await self.get_team_data(notification_data['team']) if notification_data['team'] else None
 
        notification_data['sender_data'] = sender_data
        notification_data['team_data'] = team_data

        notification_json = json.dumps(notification_data)

        print(f"Received notification in consumer for user {self.user_id}: {notification_json}")
        await self.send(text_data=notification_json)
        print(f"Sent notification to WebSocket for user {self.user_id}")

    @database_sync_to_async
    def get_sender_data(self, user_id):
        user = User.objects.get(id=user_id)
        return {
            'profile': user.profile,
            'first_name': user.first_name,
            'last_name': user.last_name
        }

    @database_sync_to_async
    def get_team_data(self, team_id):
        team = Team.objects.get(id=team_id)
        return {
            'name': team.name,
            'profile_image': team.profile_image
        }