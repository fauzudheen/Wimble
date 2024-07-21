import json
from confluent_kafka import Consumer, KafkaError
import django
import os
import sys

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_service.settings')
django.setup()

from django.db import transaction
from users.models import User, Interest

# Kafka configuration
consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'user_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['article_interests'])


def store_interest_in_db(interest_data):
    with transaction.atomic():
        Interest.objects.update_or_create(
            id=interest_data['id'],
            defaults={
                'name': interest_data['name'],
            }
        )

def consume_messages():
    try:
        print("-----------------User service Consuming messages...-----------------")
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print('End of partition reached {0}/{1}'.format(msg.topic(), msg.partition()))
                elif msg.error():
                    print('Error occurred: {0}'.format(msg.error().str()))
            else:
                topic = msg.topic()
                message_data = json.loads(msg.value().decode('utf-8'))
                
                if topic == 'article_interests':
                    store_interest_in_db(message_data)
                    print(f"Interest {message_data['id']} data stored in database")

    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        consumer.close()

if __name__ == '__main__':
    consume_messages()