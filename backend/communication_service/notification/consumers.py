import json
from channels.generic.websocket import AsyncWebsocketConsumer

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
        notification = event['notification']
        print(f"Received notification in consumer for user {self.user_id}: {notification}")
        await self.send(text_data=notification)
        print(f"Sent notification to WebSocket for user {self.user_id}")
