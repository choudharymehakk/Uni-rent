from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Item, User
from .serializers import ItemSerializer, UserSerializer


@api_view(["GET"])
def get_items(request):
    items = Item.objects.all().order_by("-created_at")
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_item(request, id):
    item = Item.objects.get(id=id)
    serializer = ItemSerializer(item)
    return Response(serializer.data)


@api_view(["GET"])
def get_user(request, id):
    user = User.objects.get(id=id)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "token": str(refresh.access_token),
            "user_id": user.id,
            "username": user.username
        })
    else:
        return Response({"error": "Invalid credentials"}, status=400)
