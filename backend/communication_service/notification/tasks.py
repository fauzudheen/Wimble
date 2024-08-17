from celery import shared_task
from .models import Notification

@shared_task
def send_meeting_notification(sender_id, receiver_id, notification_type, team_id, content):
    Notification.objects.create(
        sender_id=sender_id,
        receiver_id=receiver_id,
        notification_type=notification_type,
        team_id=team_id,
        content=content
    )