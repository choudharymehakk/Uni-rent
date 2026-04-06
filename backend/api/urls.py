from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import create_order, verify_payment
from .views import mark_cash_payment

urlpatterns = [

    # Auth
    path("register/", views.register_user),
    path("login/", views.login_user),

    # Items
    path("items/", views.get_items),
    path("items/create/", views.create_item),
    path("items/mine/", views.my_items),
    path("items/<int:id>/", views.get_item),

    # Booking
    path("items/<int:item_id>/book/", views.request_booking),
    path("bookings/mine/", views.my_bookings),
    path("bookings/incoming/", views.incoming_requests),
    path("bookings/<int:booking_id>/respond/", views.respond_booking),

    # Return flow
    path("bookings/<int:booking_id>/mark-returned/", views.mark_returned),
    path("bookings/<int:booking_id>/complete/", views.complete_booking),

    # Chat
    path("bookings/<int:booking_id>/messages/", views.get_messages),
    path("bookings/<int:booking_id>/send-message/", views.send_message),

    # ✅ PROFILE
    path("profile/", views.get_profile),
    path("profile/update/", views.update_profile),
    #payment
    path("create-order/", create_order),
    path("verify-payment/", verify_payment),
    path("bookings/<int:booking_id>/cash/", mark_cash_payment),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)