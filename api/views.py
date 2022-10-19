from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView




class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email


        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
    
    
    
    

# Create your views here.
# for django rest_framework for jwt
@api_view(['POST'])
def signup(request):
  user = User.objects.create_user(
    username = request.data['username'],
    password = request.data['password'],
    first_name = request.data['first_name'],
    last_name = request.data['last_name'],
  )
  return Response({
    "Create" : "Account Create successfully"
  }, status=200)
    
    
