import json
from confluent_kafka import Producer

class KafkaProducer:
    def __init__(self, bootstrap_servers='kafka:9092'):
        self.producer = Producer({
            'bootstrap.servers': bootstrap_servers
        })

    def produce_message(self, topic, key, value):
        print("------------From user_service producer----------------")
        print("Producing message to topic %s: key=%s value=%s" % (topic, key, value))
        try:
            self.producer.produce(topic, key=str(key), value=json.dumps(value))
            self.producer.flush()
        except Exception as e:
            print(f"Error producing message: {e}")

kafka_producer = KafkaProducer()