from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

def send_notification(user_id, notification_data):
    channel_layer = get_channel_layer()
    group_name = f'notifications_{user_id}'

    try:
        print(f"Sending notification to group: {group_name}")
        print(f"Notification data: {notification_data}")
        
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_notification',
                'notification': json.dumps(notification_data)
            }
        )
        
        print("---------------------Notification sent to channel layer----------")
    except Exception as e:
        print(f"Error sending notification: {e}")
