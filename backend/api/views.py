from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import razorpay
from django.conf import settings

from .models import Item, User, BookingRequest, Message
from .serializers import ItemSerializer, UserSerializer, RegisterSerializer, BookingSerializer


# ---------------- AUTH ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),   # ✅ FIXED
            "refresh": str(refresh),
            "username": user.username
        }, status=201)

    return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),   # ✅ FIXED
            "refresh": str(refresh),
            "username": user.username,
            "user_id": user.id
        })

    return Response({"error": "Invalid credentials"}, status=401)


# ---------------- ITEMS ----------------
@api_view(["GET"])
@permission_classes([AllowAny])
def get_items(request):
    items = Item.objects.all().order_by("-created_at")
    return Response(ItemSerializer(items, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_item(request, id):
    try:
        item = Item.objects.get(id=id)
        return Response(ItemSerializer(item).data)
    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_item(request):
    serializer = ItemSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(owner=request.user, is_available=True)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_items(request):
    items = Item.objects.filter(owner=request.user)
    return Response(ItemSerializer(items, many=True).data)


# ---------------- BOOKINGS ----------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def request_booking(request, item_id):

    try:
        # ✅ Get item safely
        item = Item.objects.get(id=item_id)

        if not item.is_available:
            return Response({"error": "Item not available"}, status=400)

        # ✅ Create booking WITHOUT dates (safe)
        booking = BookingRequest.objects.create(
            item=item,
            requester=request.user,
            start_date=None,
            end_date=None
        )

        return Response({
            "booking_id": booking.id
        })

    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    except Exception as e:
        return Response({
            "error": "Server error",
            "details": str(e)
        }, status=500)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = BookingRequest.objects.filter(requester=request.user)
    return Response(BookingSerializer(bookings, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def incoming_requests(request):
    bookings = BookingRequest.objects.filter(item__owner=request.user)
    return Response(BookingSerializer(bookings, many=True).data)


# ---------------- APPROVE / REJECT ----------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def respond_booking(request, booking_id):

    booking = BookingRequest.objects.get(id=booking_id)

    if booking.item.owner != request.user:
        return Response({"error": "Not allowed"}, status=403)

    action = request.data.get("action")

    if action == "approve":
        booking.status = "rented"
        booking.item.is_available = False

        booking.item.save()
        booking.save()

        return Response({"message": "Approved → Rented"})

    elif action == "reject":
        booking.status = "rejected"
        booking.save()

        return Response({"message": "Rejected"})

    return Response({"error": "Invalid action"}, status=400)


# ---------------- RETURN FLOW ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    data = request.data

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': data.get('razorpay_order_id'),
            'razorpay_payment_id': data.get('razorpay_payment_id'),
            'razorpay_signature': data.get('razorpay_signature')
        })

        booking = BookingRequest.objects.get(id=data.get("booking_id"))

        booking.is_paid = True
        booking.payment_method = "online"
        booking.status = "rented"   # 🔥 IMPORTANT
        booking.save()

        return Response({"status": "success"})

    except Exception as e:
        print("VERIFY ERROR:", str(e))
        return Response({
            "status": "failed",
            "error": str(e)
        }, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_booking(request, booking_id):

    booking = BookingRequest.objects.get(id=booking_id)

    if booking.item.owner != request.user:
        return Response({"error": "Not allowed"}, status=403)

    booking.status = "completed"
    booking.item.is_available = True

    booking.item.save()
    booking.save()

    return Response({"message": "Item available again"})


# ---------------- CHAT ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, booking_id):

    booking = BookingRequest.objects.get(id=booking_id)

    messages = Message.objects.filter(
        booking=booking
    ).order_by("created_at")

    data = [
        {
            "id": m.id,
            "text": m.text,
            "sender_id": m.sender.id,
            "sender": m.sender.username,
            "is_me": m.sender.id == request.user.id
        }
        for m in messages
    ]

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, booking_id):

    booking = BookingRequest.objects.get(id=booking_id)

    text = request.data.get("text")

    if not text:
        return Response({"error": "Empty message"}, status=400)

    Message.objects.create(
        booking=booking,
        sender=request.user,
        text=text
    )

    return Response({"message": "sent"})


# ---------------- PROFILE ----------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):

    user = request.user

    total_items = Item.objects.filter(owner=user).count()

    incoming_requests = BookingRequest.objects.filter(
        item__owner=user
    ).count()

    total_bookings = BookingRequest.objects.filter(
        requester=user
    ).count()

    return Response({
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "branch": user.branch,
        "year": user.year,
        "total_items": total_items,
        "incoming_requests": incoming_requests,
        "total_bookings": total_bookings
    })

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):

    user = request.user

    user.email = request.data.get("email", user.email)
    user.phone = request.data.get("phone", user.phone)
    user.branch = request.data.get("branch", user.branch)
    user.year = request.data.get("year", user.year)

    user.save()

    return Response({"message": "Profile updated"})

# ---------------- PAYMENT (RAZORPAY) ----------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):

    try:
        amount = request.data.get("amount")

        if not amount:
            return Response({"error": "Amount required"}, status=400)

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        order = client.order.create({
            "amount": int(amount) * 100,  # convert to paise
            "currency": "INR",
            "payment_capture": 1
        })

        return Response({
            "order_id": order["id"],
            "amount": order["amount"]
        })

    except Exception as e:
        print("❌ CREATE ORDER ERROR:", str(e))
        return Response({
            "error": "Order creation failed",
            "details": str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    data = request.data

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': data.get('razorpay_order_id'),
            'razorpay_payment_id': data.get('razorpay_payment_id'),
            'razorpay_signature': data.get('razorpay_signature')
        })

        booking = BookingRequest.objects.get(id=data.get("booking_id"))

        booking.is_paid = True
        booking.payment_method = "online"
        booking.status = "rented"   # 🔥 IMPORTANT
        booking.save()

        return Response({"status": "success"})

    except Exception as e:
        print("VERIFY ERROR:", str(e))
        return Response({
            "status": "failed",
            "error": str(e)
        }, status=400)
# ---------------- CASH PAYMENT ----------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_cash_payment(request, booking_id):

    try:
        booking = BookingRequest.objects.get(id=booking_id)

        # Only requester can mark payment
        if booking.requester != request.user:
            return Response({"error": "Not allowed"}, status=403)

        booking.payment_method = "cash"
        booking.is_paid = True  # or False if you want pending
        booking.save()

        return Response({"message": "Cash payment marked"})

    except BookingRequest.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_returned(request, booking_id):

    try:
        booking = BookingRequest.objects.get(id=booking_id)

        # Only owner can mark returned
        if booking.item.owner != request.user:
            return Response({"error": "Not allowed"}, status=403)

        # Only if rented
        if booking.status != "rented":
            return Response({"error": "Item is not rented"}, status=400)

        booking.status = "returned"
        booking.item.is_available = True

        booking.item.save()
        booking.save()

        return Response({"message": "Item returned successfully"})

    except BookingRequest.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)