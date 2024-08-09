import json
from confluent_kafka import Consumer, KafkaError
import django
import os
import sys


parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'communication_service.settings')
django.setup()

from chat.models import User, Team #This line should be below django.setup(), otherwise it will not work
from notification.models import Notification
from django.db import transaction

# Kafka configuration
consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'communication_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['users', 'users-deleted', 'teams', 'teams-deleted', 'relations'])

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
                        print(f"User {message_data['id']} data stored in database")
                    elif topic == 'users-deleted':
                        delete_user_from_db(message_data)
                        print(f"User {message_data['id']} deleted from database")
                    elif topic == 'teams':
                        store_team_in_db(message_data)
                        print(f"Team {message_data['id']} data stored in database")
                    elif topic == 'teams-deleted':
                        delete_team_from_db(message_data)
                        print(f"Team {message_data['id']} deleted from database")
                    elif topic == 'relations':
                        store_relation_in_db(message_data)
                        print(f"Relation {message_data['id']} data stored in database")
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