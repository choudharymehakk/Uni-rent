from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

import qrcode
import os
from django.conf import settings

from .models import Item, User, BookingRequest
from .serializers import ItemSerializer, UserSerializer, RegisterSerializer, BookingSerializer


# ---------------- REGISTER ----------------

@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "token": str(refresh.access_token),
            "username": user.username
        }, status=201)

    return Response(serializer.errors, status=400)


# ---------------- LOGIN ----------------

@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)

        return Response({
            "token": str(refresh.access_token),
            "username": user.username,
            "user_id": user.id
        })

    return Response({"error": "Invalid credentials"}, status=401)


# ---------------- GET USER ----------------

@api_view(["GET"])
@permission_classes([AllowAny])
def get_user(request, id):

    try:
        user = User.objects.get(id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


# ---------------- GET ALL ITEMS ----------------

@api_view(["GET"])
@permission_classes([AllowAny])
def get_items(request):

    items = Item.objects.all().order_by("-created_at")
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data)


# ---------------- GET SINGLE ITEM ----------------

@api_view(["GET"])
@permission_classes([AllowAny])
def get_item(request, id):

    try:
        item = Item.objects.get(id=id)
        serializer = ItemSerializer(item)

        return Response(serializer.data)

    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)


# ---------------- CREATE ITEM ----------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_item(request):

    serializer = ItemSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(owner=request.user, is_available=True)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# ---------------- UPDATE ITEM ----------------

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_item(request, pk):

    try:
        item = Item.objects.get(pk=pk)

        if item.owner != request.user:
            return Response({"error": "Not allowed"}, status=403)

        serializer = ItemSerializer(item, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)


# ---------------- DELETE ITEM ----------------

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_item(request, pk):

    try:
        item = Item.objects.get(pk=pk)

        if item.owner != request.user:
            return Response({"error": "Not allowed"}, status=403)

        item.delete()

        return Response({"message": "Item deleted"}, status=200)

    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)


# ---------------- MY ITEMS ----------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_items(request):

    items = Item.objects.filter(owner=request.user)
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data)


# ---------------- REQUEST BOOKING ----------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def request_booking(request, item_id):

    try:
        item = Item.objects.get(id=item_id)

        if not item.is_available:
            return Response({"error": "Item not available"}, status=400)

        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        booking = BookingRequest.objects.create(
            item=item,
            requester=request.user,
            start_date=start_date,
            end_date=end_date
        )

        return Response({
            "message": "Booking request sent",
            "booking_id": booking.id
        })

    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)


# ---------------- MY BOOKINGS ----------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_bookings(request):

    bookings = BookingRequest.objects.filter(requester=request.user)
    serializer = BookingSerializer(bookings, many=True)

    return Response(serializer.data)


# ---------------- INCOMING REQUESTS ----------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def incoming_requests(request):

    bookings = BookingRequest.objects.filter(item__owner=request.user)
    serializer = BookingSerializer(bookings, many=True)

    return Response(serializer.data)


# ---------------- APPROVE / REJECT BOOKING ----------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def respond_booking(request, booking_id):

    try:

        booking = BookingRequest.objects.get(id=booking_id)

        if booking.item.owner != request.user:
            return Response({"error": "Not allowed"}, status=403)

        action = request.data.get("action")

        if action == "approve":

            booking.status = "approved"

            qr_data = f"BOOKING_{booking.id}"
            qr = qrcode.make(qr_data)

            qr_folder = os.path.join(settings.MEDIA_ROOT, "qr_codes")
            os.makedirs(qr_folder, exist_ok=True)

            qr_path = os.path.join(qr_folder, f"booking_{booking.id}.png")
            qr.save(qr_path)

            booking.pickup_qr = f"qr_codes/booking_{booking.id}.png"
            booking.save()

            return Response({"message": "Booking approved and QR generated"})

        elif action == "reject":

            booking.status = "rejected"
            booking.save()

            return Response({"message": "Booking rejected"})

        return Response({"error": "Invalid action"}, status=400)

    except BookingRequest.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)


# ---------------- PICKUP VIA QR ----------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def pickup_item(request, booking_id):

    try:

        booking = BookingRequest.objects.get(id=booking_id)

        if booking.status != "approved":
            return Response({"error": "Booking not approved"}, status=400)

        booking.status = "rented"
        booking.item.is_available = False

        booking.item.save()
        booking.save()

        return Response({"message": "Item pickup verified. Rental started."})

    except BookingRequest.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)


# ---------------- RETURN IMAGE ----------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_return_image(request, booking_id):

    try:

        booking = BookingRequest.objects.get(id=booking_id)
        image = request.FILES.get("return_image")

        if not image:
            return Response({"error": "Image required"}, status=400)

        booking.return_image = image
        booking.save()

        return Response({"message": "Return image uploaded"})

    except BookingRequest.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)


# ---------------- COMPLETE BOOKING ----------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_booking(request, booking_id):

    try:

        booking = BookingRequest.objects.get(id=booking_id)

        if booking.item.owner != request.user:
            return Response({"error": "Not allowed"}, status=403)

        booking.status = "completed"
        booking.item.is_available = True

        booking.item.save()
        booking.save()

        return Response({"message": "Booking completed and item available again"})

    except BookingRequest.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
# ---------------- MARK ITEM AVAILABLE AGAIN ----------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_item_available(request, item_id):

    try:
        item = Item.objects.get(id=item_id)

        if item.owner != request.user:
            return Response({"error": "Not allowed"}, status=403)

        item.is_available = True
        item.save()

        return Response({"message": "Item marked available again"})

    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)