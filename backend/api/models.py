from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("Username required")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
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


class User(AbstractUser):
    phone = models.CharField(max_length=15)
    branch = models.CharField(max_length=50)
    year = models.IntegerField()

    objects = UserManager()

    def __str__(self):
        return self.username
class Item(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="items")
    title = models.CharField(max_length=200)
    description = models.TextField()
    price_per_day = models.IntegerField()
    image = models.ImageField(upload_to="items/")
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
