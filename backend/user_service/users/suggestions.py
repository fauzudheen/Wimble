from django.db.models import Q, Count
from .models import User
from collections import defaultdict

def get_users_to_follow_suggestions(user_id, limit=4):

    user = User.objects.get(id=user_id)

    # Get users the current user is already following
    following_ids = user.followings.values_list('following_id', flat=True)

    # Get users with similar skills
    similar_skill_users = User.objects.filter(
        skills__skill__in=user.skills.values('skill')
    ).exclude(
        id__in=following_ids
    ).exclude(
        id=user.id
    ).annotate(
        common_skills_count=Count('skills')
    ).order_by('-common_skills_count')


    # Get users with similar interests
    similar_interest_users = User.objects.filter(
        userinterest__interest__in=user.userinterest_set.values('interest')
    ).exclude(
        id__in=following_ids
    ).exclude(
        id=user.id
    ).annotate(
        common_interests_count=Count('userinterest')
    ).order_by('-common_interests_count')


    # Get users followed by users the current user is following (friends of friends)
    # Get all users whose followers are in the list of my followings
    friends_of_friends = User.objects.filter(
        followers__follower__in=following_ids
    ).exclude(
        id__in=following_ids
    ).exclude(
        id=user.id
    ).annotate(
        friend_count=Count('followers')
    ).order_by('-friend_count')


    # Combine and weight the results
    suggestion_scores = defaultdict(float)

    for u in similar_skill_users:
        suggestion_scores[u.id] += u.common_skills_count * 2

    for u in similar_interest_users:
        suggestion_scores[u.id] += u.common_interests_count * 1.5

    for u in friends_of_friends:
        suggestion_scores[u.id] += u.friend_count * 1.2

    top_suggestions = sorted(suggestion_scores.items(), key=lambda x: x[1], reverse=True)[:limit]

    suggested_users = User.objects.filter(id__in=[user_id for user_id, _ in top_suggestions])

    return suggested_users