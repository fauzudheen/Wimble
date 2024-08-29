from utils.services import USER_SERVICE_URL, ARTICLE_SERVICE_URL, COMMUNITY_SERVICE_URL, TEAM_SERVICE_URL, PAYMENT_SERVICE_URL
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from concurrent.futures import ThreadPoolExecutor, as_completed

class SearchView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        if not query:
            return Response({"error": "No search query provided"}, status=400)

        services = {
            'users': f"{USER_SERVICE_URL}/search/users/",
            'tags': f"{USER_SERVICE_URL}/search/tags/",
            'articles': f"{ARTICLE_SERVICE_URL}/search/",
            'communities': f"{COMMUNITY_SERVICE_URL}/search/",
            'teams': f"{TEAM_SERVICE_URL}/search/"
        }

        headers = dict(request.headers)
        params = {'query': query}

        def fetch_service(service_name, url):
            try:
                response = requests.get(url, headers=headers, params=params, timeout=5)
                response.raise_for_status()
                return service_name, response.json()
            except requests.RequestException as e:
                print(f"Error fetching {service_name}: {str(e)}")
                return service_name, []

        aggregated_results = {}
        with ThreadPoolExecutor(max_workers=len(services)) as executor:
            future_to_service = {executor.submit(fetch_service, name, url): name for name, url in services.items()}
            for future in future_to_service:
                service_name, result = future.result()
                aggregated_results[service_name] = result

        return Response(aggregated_results) 

class FetchAllView(APIView):
    def get(self, request):
        services = {
            'users': f"{USER_SERVICE_URL}/fetchall-users/",
            'articles': f"{ARTICLE_SERVICE_URL}/fetchall-articles/",
            'communities': f"{COMMUNITY_SERVICE_URL}/fetchall-communities/",
            'teams': f"{TEAM_SERVICE_URL}/fetchall-teams/",
            'payments': f"{PAYMENT_SERVICE_URL}/fetchall-payments/",
        }

        headers = dict(request.headers)

        def fetch_service(service_name, url):
            try:
                response = requests.get(url, headers=headers, timeout=5)
                response.raise_for_status()
                return service_name, response.json()
            except requests.RequestException as e:
                print(f"Error fetching {service_name}: {str(e)}")
                return service_name, []
            
        aggregated_results = {}
        with ThreadPoolExecutor(max_workers=len(services)) as executor:
            future_to_service = {executor.submit(fetch_service, name, url): name for name, url in services.items()}
            for future in future_to_service:
                service_name, result = future.result()
                aggregated_results[service_name] = result

        return Response(aggregated_results)