import json
from confluent_kafka import Consumer, KafkaError
import django
import os
import sys
from datetime import datetime, timedelta

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'communication_service.settings')
django.setup()

#The following lines should be below django.setup(), otherwise it will not work
#You need to ensure that Django is properly configured before importing any Django models or apps
from chat.models import User, Team, TeamMember 
from notification.models import Notification
from django.db import transaction
from notification.tasks import send_meeting_notification

# Kafka configuration
consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'communication_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['users', 'users-deleted', 'teams', 'teams-deleted', 'relations', 'team-members', 'team-members-deleted', 'team-meetings', 'team-meetings-deleted'])

def store_user_in_db(user_data):
    print("------------------store_user view called in communication service-----------------")
    with transaction.atomic():
        try:
            User.objects.update_or_create(
                id=user_data['id'],
                defaults={
                    'first_name': user_data.get('first_name', '')[:150],  # Truncate if necessary
                    'last_name': user_data.get('last_name', '')[:150],    # Truncate if necessary
                    'tagline': user_data.get('tagline', '')[:225],        # Truncate if necessary
                    'profile': user_data.get('profile', '')[:100],        # Truncate if necessary
                }
            )
        except Exception as e:
            print(f"Error storing user data: {e}")

def delete_user_from_db(user_data):
    print("------------------delete_user view called in communication service-----------------")
    with transaction.atomic():
        try:
            user_id = user_data['id']
            User.objects.filter(id=user_id).delete()
            print(f"User {user_id} deleted from database")
        except Exception as e:
            print(f"Error deleting user data: {e}")

def store_team_in_db(team_data):
    print("------------------store_team view called in communication service-----------------")
    with transaction.atomic():
        try:
            Team.objects.update_or_create(
                id=team_data['id'],
                defaults={
                    'name': team_data.get('name', ''),
                    'profile_image': team_data.get('profile_image', ''),
                    'description': team_data.get('description', ''),
                    'maximum_members': team_data.get('maximum_members', 0),
                    'status': team_data.get('status', 'active'),
                    'privacy': team_data.get('privacy', 'public'),
                }
            )
            print(f"Team {team_data['id']} data stored in database")
        except Exception as e:
            print(f"Error storing team data: {e}")

def delete_team_from_db(team_data):
    print("------------------delete_team view called in communication service-----------------")
    with transaction.atomic():
        try:
            team_id = team_data['id']
            Team.objects.filter(id=team_id).delete()
            print(f"Team {team_id} deleted from database")
        except Exception as e:
            print(f"Error deleting team data: {e}")

def store_relation_in_db(relation_data):
    print("------------------store_relation view called in communication service-----------------")
    with transaction.atomic():
        try:
            follower = User.objects.get(id=relation_data['follower_id'])
            notification = Notification.objects.create(
                sender_id=relation_data['follower_id'],
                receiver_id=relation_data['following_id'],
                notification_type='follow',
                content=f"{follower.first_name} {follower.last_name} started following you",
            )

            print("------------------Notification created-----------------", notification)
            print(f"Rel {notification.id} data stored in database") 
        except Exception as e:
            print(f"Error storing relation data: {e}")

def store_team_member_in_db(team_member_data):
    print("------------------store_team_member view called in communication service-----------------")
    with transaction.atomic():
        try:
            TeamMember.objects.update_or_create(
                id=team_member_data['id'],
                defaults={
                    'team_id': team_member_data['team_id'],
                    'user_id': team_member_data['user_id'],
                    'role': team_member_data['role'],
                    'request_status': team_member_data['request_status'],
                }
            )
            print(f"Team member {team_member_data['id']} data stored in database")
        except Exception as e:
            print(f"Error storing team member data: {e}")

def delete_team_member_from_db(team_member_data):
    print("------------------delete_team_member view called in communication service-----------------")
    with transaction.atomic():
        try:
            team_member_id = team_member_data['id']
            TeamMember.objects.filter(id=team_member_id).delete()
            print(f"Team member {team_member_id} deleted from database")
        except Exception as e:
            print(f"Error deleting team member data: {e}")

def send_meeting_notification(meeting_data):
    print("------------------send_meeting_notification view called in communication service-----------------")
    try:
        start_time = datetime.fromisoformat(meeting_data['start_time'])
        notification_time = start_time - timedelta(minutes=10)
        members = meeting_data['members']
        print("------------------Members--------------", members)
        print("------------------Notification time--------------", notification_time)
        print("------------------Start time--------------", start_time)
        # print(f"Meeting notification sent to {meeting_data['receiver_id']}")
    except Exception as e:
        print(f"Error sending meeting notification: {e}")

# @shared_task
# def send_meeting_notification(sender_id, receiver_id, notification_type, team_id, content):
#     Notification.objects.create(
#         sender_id=sender_id,
#         receiver_id=receiver_id,
#         notification_type=notification_type,
#         team_id=team_id,
#         content=content
#     )

def consume_messages():
    try:
        print("-----------------Communication service Consuming messages...-----------------")
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print('End of partition reached {0}/{1}'.format(msg.topic(), msg.partition()))
                else:
                    print('Error occurred: {0}'.format(msg.error().str()))
            else:
                try:
                    topic = msg.topic()
                    message_data = json.loads(msg.value().decode('utf-8'))
                    print(f"Received message: {message_data}")
                    print(f"Topic: {topic}")
                    print(f"Message: {msg}")
                    if topic == 'users':
                        store_user_in_db(message_data)
                    elif topic == 'users-deleted':
                        delete_user_from_db(message_data)
                    elif topic == 'teams':
                        store_team_in_db(message_data)
                    elif topic == 'teams-deleted':
                        delete_team_from_db(message_data)
                    elif topic == 'relations':
                        store_relation_in_db(message_data)
                    elif topic == 'relations-deleted':
                        pass
                    elif topic == 'team-members':
                        store_team_member_in_db(message_data)
                    elif topic == 'team-members-deleted':
                        delete_team_member_from_db(message_data)
                    elif topic == 'team-meetings':
                        send_meeting_notification(message_data)
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {e}")
                except Exception as e:
                    print(f"Error processing message: {e}")

    except Exception as e:
        print(f"Unexpected error: {e}") 
    finally:
        consumer.close()


if __name__ == '__main__':
    consume_messages()