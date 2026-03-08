from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("register/", views.register_user),
    path("login/", views.login_user),

    # Items
    path("items/", views.get_items),
    path("items/create/", views.create_item),       # ✅ create pehle, warna <int:id> pakad leta
    path("items/mine/", views.my_items),
    path("items/<int:id>/", views.get_item),
    path("items/<int:pk>/update/", views.update_item),
    path("items/<int:pk>/delete/", views.delete_item),
    

    # Users
    path("users/<int:id>/", views.get_user),


    # Booking lifecycle
path("items/<int:item_id>/book/", views.request_booking),
path("bookings/mine/", views.my_bookings),
path("bookings/incoming/", views.incoming_requests),
path("bookings/<int:booking_id>/respond/", views.respond_booking),

# QR pickup
path("bookings/<int:booking_id>/pickup/", views.pickup_item),

# return proof
path("bookings/<int:booking_id>/return/", views.upload_return_image),

# complete booking
path("bookings/<int:booking_id>/complete/", views.complete_booking),
    # Bookings
    path("items/<int:item_id>/book/", views.request_booking),
    path("bookings/mine/", views.my_bookings),
    path("bookings/incoming/", views.incoming_requests),
    path("bookings/<int:booking_id>/respond/", views.respond_booking),
    path("items/<int:item_id>/mark-available/", views.mark_item_available),
]