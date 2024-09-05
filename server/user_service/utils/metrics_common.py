from prometheus_client import Counter
from prometheus_client import Gauge


#initialise a prometheus counter
class Metrics:
    upload_urls_created = Counter('upload_urls', 'total number of upload urls created')