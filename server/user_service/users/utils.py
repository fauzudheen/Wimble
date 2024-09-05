
from django.core.mail import send_mail
from django.conf import settings

def send_otp(email, otp):
    subject = 'Your OTP Code'
    message = f'Your OTP code is {otp}'
    print("New------------message----------", message)
    email_from = settings.EMAIL_HOST_USER
    print("-----------email_from----------", email_from)
    recipient_list = [email]
    print("-----------recipient_list----------", recipient_list)
    send_mail(subject, message, email_from, recipient_list, fail_silently=False)
