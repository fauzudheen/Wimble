from celery import shared_task
from .models import Notification, NotificationPreference
from datetime import datetime, timedelta
from .notification import send_group_notification

@shared_task
def send_meeting_notification(meeting_data):
    print("------------------send_meeting_notification task called-----------------")
    try:
        start_time = datetime.fromisoformat(meeting_data['start_time'])
        current_time = datetime.now(start_time.tzinfo)  
        minutes_until_meeting = max(int((start_time - current_time).total_seconds() / 60), 0) + 1

        content = (
                f"You have a meeting in {minutes_until_meeting} minute(s) at {start_time}"
                if minutes_until_meeting < 9 else
                f"You have a meeting in 10 minutes at {start_time}"
            )
        
        members = meeting_data['members']
        
        for member in members:
            notification_preference = NotificationPreference.objects.get(user_id=member)
            if notification_preference.meetings:
                Notification.objects.create(
                    sender_id=meeting_data.get('sender_id'),
                    receiver_id=member,
                    notification_type='meeting',
                    team_id=meeting_data.get('team_id'),
                    content=content
                )
        
        print(f"Meeting notifications sent to {len(members)} members")
        print(f"Meeting start time: {start_time}")
        send_group_notification(members, meeting_data)
    except Exception as e:
        print(f"Error sending meeting notification: {e}")