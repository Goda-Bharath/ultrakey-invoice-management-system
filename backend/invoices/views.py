from rest_framework import viewsets
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from .models import (
    Client,
    Invoice,
    InvoiceItem,
    Quote,
    QuoteItem,
    GeneralSettings,
    BusinessSettings,
    QuotationSettings,
    InvoiceSettings,
    PaymentSettings,
    TaxSettings,
    EmailSettings,
    PDFSettings,
    TranslateSettings,
)

from .serializers import (
    ClientSerializer,
    InvoiceSerializer,
    InvoiceItemSerializer,
    QuoteSerializer,
    QuoteItemSerializer,
    GeneralSettingsSerializer,
    BusinessSettingsSerializer,
    QuotationSettingsSerializer,
    InvoiceSettingsSerializer,
    PaymentSettingsSerializer,
    TaxSettingsSerializer,
    EmailSettingsSerializer,
    PDFSettingsSerializer,
    TranslateSettingsSerializer,
)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by("-id")
    serializer_class = ClientSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by("-id")
    serializer_class = InvoiceSerializer


class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all().order_by("-id")
    serializer_class = InvoiceItemSerializer


class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all().order_by("-id")
    serializer_class = QuoteSerializer


class QuoteItemViewSet(viewsets.ModelViewSet):
    queryset = QuoteItem.objects.all().order_by("-id")
    serializer_class = QuoteItemSerializer


# ---------------- SETTINGS VIEWSETS ----------------

class GeneralSettingsViewSet(viewsets.ModelViewSet):
    queryset = GeneralSettings.objects.all().order_by("-id")
    serializer_class = GeneralSettingsSerializer


class BusinessSettingsViewSet(viewsets.ModelViewSet):
    queryset = BusinessSettings.objects.all().order_by("-id")
    serializer_class = BusinessSettingsSerializer


class QuotationSettingsViewSet(viewsets.ModelViewSet):
    queryset = QuotationSettings.objects.all().order_by("-id")
    serializer_class = QuotationSettingsSerializer


class InvoiceSettingsViewSet(viewsets.ModelViewSet):
    queryset = InvoiceSettings.objects.all().order_by("-id")
    serializer_class = InvoiceSettingsSerializer


class PaymentSettingsViewSet(viewsets.ModelViewSet):
    queryset = PaymentSettings.objects.all().order_by("-id")
    serializer_class = PaymentSettingsSerializer


class TaxSettingsViewSet(viewsets.ModelViewSet):
    queryset = TaxSettings.objects.all().order_by("-id")
    serializer_class = TaxSettingsSerializer


class EmailSettingsViewSet(viewsets.ModelViewSet):
    queryset = EmailSettings.objects.all().order_by("-id")
    serializer_class = EmailSettingsSerializer


class PDFSettingsViewSet(viewsets.ModelViewSet):
    queryset = PDFSettings.objects.all().order_by("-id")
    serializer_class = PDFSettingsSerializer


class TranslateSettingsViewSet(viewsets.ModelViewSet):
    queryset = TranslateSettings.objects.all().order_by("-id")
    serializer_class = TranslateSettingsSerializer

@api_view(["POST"])
def register_user(request):
    full_name = request.data.get("full_name")
    Nikename =  request.data.get("Nikename")
    company_name = request.data.get("company_name")
    email = request.data.get("email")
    phone = request.data.get("phone")
    password = request.data.get("password")

    if not full_name or not email or not password:
        return Response(
            {"error": "Full name, email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=email).exists():
        return Response(
            {"error": "This email is already registered."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=full_name
    )

    token, created = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Registration successful",
            "token": token.key,
            "user": {
                "id": user.id,
                "name": user.first_name,
                "email": user.email,
                "company_name": company_name,
                "phone": phone
            }
        },
        status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        username=email,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, created = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Login successful",
            "token": token.key,
            "user": {
                "id": user.id,
                "name": user.first_name,
                "email": user.email
            }
        },
        status=status.HTTP_200_OK
    )