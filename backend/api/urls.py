from django.urls import path
from . import views

urlpatterns = [
    path("items/", views.get_items),
    path("items/<int:id>/", views.get_item),
    path("users/<int:id>/", views.get_user),
    path("login/", views.login_user),
]

