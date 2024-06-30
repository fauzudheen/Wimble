import os
import django
import logging
from django.contrib.auth.hashers import check_password

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_service.settings')

# Initialize Django
django.setup()

# Stored hash and input password for testing
stored_hash = "pbkdf2_sha256$720000$l6J5PLgYcV3wZmnQzBm95g$RQjg4S80gZyKJsP8cOn4LH9nnswC/ryoVTg9pTx9Dew="
input_password = "hamrazasd"

logging.debug(f"Verifying password for stored hash: {stored_hash}")

# Check password
if check_password(input_password, stored_hash):
    logging.debug("Password is correct")
else:
    logging.debug("Password is incorrect")
