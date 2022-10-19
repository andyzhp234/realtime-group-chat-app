from django.db import models


# Create your models here.
class Message(models.Model):
  chatRoom = models.CharField(max_length=120)
  firstname = models.CharField(max_length=120)
  username = models.CharField(max_length=120)
  content = models.TextField()
  icons = models.CharField(max_length=120)
  timestamp = models.DateTimeField(auto_now_add=True)