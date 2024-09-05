import json
from confluent_kafka import Consumer, KafkaError
import django
import os
import sys


parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'community_service.settings')
django.setup()

from community_app.models import User #This line should be below django.setup(), otherwise it will not work
from django.db import transaction

# Kafka configuration
consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'community_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['users', 'users-deleted'])

def store_user_in_db(user_data):
    print("------------------store_user view called in community service-----------------")
    with transaction.atomic():
        try:
            User.objects.update_or_create(
                id=user_data['id'],
                defaults={
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', ''),   
                    'tagline': user_data.get('tagline', ''),      
                    'profile': user_data.get('profile', ''),   
                }
            )
        except Exception as e:
            print(f"Error storing user data: {e}")

def delete_user_from_db(user_data):
    print("------------------delete_user view called in community service-----------------")
    with transaction.atomic():
        try:
            user_id = user_data['id']
            User.objects.filter(id=user_id).delete()
            print(f"User {user_id} deleted from database")
        except Exception as e:
            print(f"Error deleting user data: {e}")


def consume_messages():
    try:
        print("-----------------Community service Consuming messages...-----------------")
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