from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


# ---------------- USER MANAGER ----------------

class UserManager(BaseUserManager):

    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("Username required")

        email = self.normalize_email(email)

        user = self.model(
            username=username,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('phone', '0000000000')
        extra_fields.setdefault('branch', 'CSE')
        extra_fields.setdefault('year', 1)

        return self.create_user(username, email, password, **extra_fields)


# ---------------- USER MODEL ----------------

class User(AbstractUser):

    phone = models.CharField(max_length=15)
    branch = models.CharField(max_length=50)
    year = models.IntegerField()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',
        blank=True
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_set',
        blank=True
    )

    def __str__(self):
        return self.username


# ---------------- ITEM MODEL ----------------

class Item(models.Model):

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="items"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    category = models.CharField(max_length=100, blank=True)
    condition = models.CharField(max_length=100, blank=True)

    price_per_day = models.IntegerField()
    deposit = models.IntegerField(default=0)

    image = models.ImageField(upload_to="items/")

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ---------------- BOOKING MODEL ----------------

class BookingRequest(models.Model):

    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="requests"
    )

    requester = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    # QR code generated for pickup verification
    pickup_qr = models.ImageField(
        upload_to="qr_codes/",
        null=True,
        blank=True
    )

    # renter uploads image while returning item
    return_image = models.ImageField(
        upload_to="returns/",
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("rented", "Rented"),
            ("completed", "Completed"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.requester.username} -> {self.item.title}"