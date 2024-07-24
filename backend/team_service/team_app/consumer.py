import json
from confluent_kafka import Consumer, KafkaError
import django
import os
import sys

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'team_service.settings')
django.setup()

from django.db import transaction

# Kafka configuration
consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'team_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe(['users'])



def consume_messages():
    try:
        print("-----------------Team service Consuming messages...-----------------")
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
                print(f"Received message: {message_data}")

    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        consumer.close()

if __name__ == '__main__':
    consume_messages()