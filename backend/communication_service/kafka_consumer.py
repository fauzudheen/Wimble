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
from notification.models import Relation, Article, Like, Comment, Notification, NotificationPreference
from django.db import transaction
from notification.tasks import send_meeting_notification

# Kafka configuration
consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'communication_service_group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe([
    'users', 'users-deleted', 'teams', 'teams-deleted', 'relations', 'relations-deleted',
    'team-members', 'team-members-deleted', 'team-meetings', 'team-meetings-deleted',
    'articles', 'articles-deleted', 'likes', 'likes-deleted', 'comments', 'comments-deleted',
                    ])

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
            _, created = Relation.objects.update_or_create(
                id=relation_data['id'],
                defaults={
                    'follower_id': relation_data['follower_id'],
                    'following_id': relation_data['following_id'],
                }
            )

            print(f"Rel {relation_data['id']} data stored in database")

            follower = User.objects.get(id=relation_data['follower_id'])
            notification_preference = NotificationPreference.objects.filter(user_id=relation_data['following_id']).first()

            if created:
                if notification_preference.follows:
                    notification = Notification.objects.create(
                        sender_id=relation_data['follower_id'],
                        receiver_id=relation_data['following_id'],
                        notification_type='follow',
                        relation_id=relation_data['id'],
                        content=f"{follower.first_name} {follower.last_name} started following you",
                    )

                    print("------------------Follow Notification created-----------------", notification)
            else:
                # Find and delete the existing notification
                notification = Notification.objects.filter(relation_id=relation_data['id']).first()
                notification.delete()
                print("------------------Existing Relation Notification deleted-----------------", notification)

                # Create a new notification
                if notification_preference.follows:
                    notification = Notification.objects.create(
                        sender_id=relation_data['follower_id'],
                        receiver_id=relation_data['following_id'],
                        notification_type='follow',
                        relation_id=relation_data['id'],
                        content=f"{follower.first_name} {follower.last_name} started following you",
                    )

                print("------------------New Relation Notification created-----------------", notification)


        except Exception as e:
            print(f"Error storing relation data: {e}")

def delete_relation_from_db(relation_data):
    print("------------------delete_relation view called in communication service-----------------")
    with transaction.atomic():
        try:
            relation_id = relation_data['id']
            Relation.objects.filter(id=relation_id).delete()
            print(f"Relation {relation_id} deleted from database")
        except Exception as e:
            print(f"Error deleting relation data: {e}")

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

def handle_meeting_message(meeting_data):
    start_time = datetime.fromisoformat(meeting_data['start_time'])
    notification_time = start_time - timedelta(minutes=10)
    send_meeting_notification.apply_async((meeting_data,), eta=notification_time)

def store_article_in_db(article_data):
    print("------------------store_article view called in communication service-----------------") 
    with transaction.atomic():
        try:
            Article.objects.update_or_create(
                id=article_data['id'],
                defaults={
                    'author_id': article_data['author_id'],
                    'title': article_data['title'],
                    'content': article_data['content'],
                    'thumbnail': article_data['thumbnail'],
                }
            )
            print(f"Article {article_data['id']} data stored in database")
        except Exception as e:
            print(f"Error storing article data: {e}")

def delete_article_from_db(article_data):
    print("------------------delete_article view called in communication service-----------------")
    with transaction.atomic():
        try:
            article_id = article_data['id']
            Article.objects.filter(id=article_id).delete()
            print(f"Article {article_id} deleted from database")
        except Exception as e:
            print(f"Error deleting article data: {e}")

def store_comment_in_db(comment_data):
    print("------------------store_comment view called in communication service-----------------")
    with transaction.atomic():
        try:
            _, created = Comment.objects.update_or_create(
                id=comment_data['id'],
                defaults={
                    'article_id': comment_data['article_id'],
                    'user_id': comment_data['user_id'],
                    'text': comment_data['text'],
                    'parent_id': comment_data.get('parent_id') or None,
                }
            )
            print(f"Comment {comment_data['id']} {'created' if created else 'updated'} in the database")

            sender = User.objects.get(id=comment_data['user_id'])
            article = Article.objects.get(id=comment_data['article_id'])
            notification_preference = NotificationPreference.objects.filter(user_id=article.author_id).first()

            if created:
                if notification_preference.comments:
                    notification = Notification.objects.create(
                        sender_id=comment_data['user_id'],
                        receiver_id=article.author_id,
                        notification_type='comment',
                        article_id=article.id,
                        comment_id=comment_data['id'],
                        content=f"{sender.first_name} {sender.last_name} commented on your article",
                    )
                    print("------------------Comment Notification created-----------------", notification)
            else:
                # Find and delete the existing notification
                notification = Notification.objects.filter(comment_id=comment_data['id']).first()

                if notification:
                    notification.delete()
                    print("------------------Existing Comment Notification deleted-----------------")

                # Create a new notification after deletion
                if notification_preference.comments:
                    new_notification = Notification.objects.create(
                        sender_id=comment_data['user_id'],
                        receiver_id=article.author_id,
                        notification_type='comment',
                        article_id=article.id,
                        comment_id=comment_data['id'],
                        content=f"{sender.first_name} {sender.last_name} updated their comment on your article",
                    )
                    print("------------------New Comment Notification created-----------------", new_notification)

        except Exception as e:
            print("------------------Error storing comment data-----------------", e)
            print(f"Error storing comment data: {e}")


def delete_comment_from_db(comment_data):
    print("------------------delete_comment view called in communication service-----------------")
    with transaction.atomic():
        try:
            comment_id = comment_data['id']
            Comment.objects.filter(id=comment_id).delete()
            print(f"Comment {comment_id} deleted from database")
        except Exception as e:
            print(f"Error deleting comment data: {e}")

def store_like_in_db(like_data):
    print("------------------store_like view called in communication service-----------------")
    with transaction.atomic():
        try:
            _, created = Like.objects.update_or_create(
                id=like_data['id'],
                defaults={
                    'article_id': like_data['article_id'],
                    'user_id': like_data['user_id'],
                }
            )
            print(f"Like {like_data['id']} data stored in database")

            sender = User.objects.get(id=like_data['user_id'])
            article = Article.objects.get(id=like_data['article_id'])
            notification_preference = NotificationPreference.objects.filter(user_id=article.author_id).first()

            if created:
                if notification_preference.likes:
                    notification = Notification.objects.create(
                        sender_id=like_data['user_id'],
                        receiver_id=article.author_id,
                        notification_type='like',
                        article_id=article.id,
                        like_id=like_data['id'],
                        content=f"{sender.first_name} {sender.last_name} liked your article",
                    )

                    print("------------------Like Notification created-----------------", notification)
            else:
                # Find and delete the existing notification
                notification = Notification.objects.filter(like_id=like_data['id']).first()

                if notification:
                    notification.delete()
                    print("------------------Existing Like Notification deleted-----------------")

                # Create a new notification after deletion
                if notification_preference.likes:
                    new_notification = Notification.objects.create(
                        sender_id=like_data['user_id'],
                        receiver_id=article.author_id,
                        notification_type='like',
                        article_id=article.id,
                        like_id=like_data['id'],
                        content=f"{sender.first_name} {sender.last_name} updated their like on your article",
                    )
                    print("------------------New Like Notification created-----------------", new_notification)
        except Exception as e:
            print(f"Error storing like data: {e}")

def delete_like_from_db(like_data):
    print("------------------delete_like view called in communication service-----------------")
    with transaction.atomic():
        try:
            like_id = like_data['id']
            Like.objects.filter(id=like_id).delete()
            print(f"Like {like_id} deleted from database")
        except Exception as e:
            print(f"Error deleting like data: {e}")    

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
                        delete_relation_from_db(message_data)
                    elif topic == 'team-members':
                        store_team_member_in_db(message_data)
                    elif topic == 'team-members-deleted':
                        delete_team_member_from_db(message_data)
                    elif topic == 'team-meetings':
                        handle_meeting_message(message_data)
                    elif topic == 'articles':
                        store_article_in_db(message_data)
                    elif topic == 'articles-deleted':
                        delete_article_from_db(message_data)
                    elif topic == 'comments':
                        store_comment_in_db(message_data)
                    elif topic == 'comments-deleted':
                        delete_comment_from_db(message_data)
                    elif topic == 'likes':
                        store_like_in_db(message_data)
                    elif topic == 'likes-deleted':
                        delete_like_from_db(message_data)
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