from utils import services
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse


class MediaView(APIView):
    def get(self, request):
        original_path = request.path
        media_index = original_path.find("/media/")

        service_url = ""
        
        if "team_service" in original_path:
            service_url = f"{services.TEAM_SERVICE_URL}{original_path[media_index:]}"
        if "communication_service" in original_path:
            service_url = f"{services.COMMUNICATION_SERVICE_URL}{original_path[media_index:]}"
        if "article_service" in original_path:
            service_url = f"{services.ARTICLE_SERVICE_URL}{original_path[media_index:]}"
        if "user_service" in original_path:
            service_url = f"{services.USER_SERVICE_URL}{original_path[media_index:]}"
        if "community_service" in original_path:
            service_url = f"{services.COMMUNITY_SERVICE_URL}{original_path[media_index:]}"

        response = requests.get(service_url, headers=dict(request.headers))

        if response.status_code == 200:
            # Create an HttpResponse object with the content of the media file
            content_type = response.headers.get('Content-Type', 'application/octet-stream')
            return HttpResponse(response.content, content_type=content_type)
        else:
            return Response({"error": "Failed to retrieve media file"}, status=response.status_code)
