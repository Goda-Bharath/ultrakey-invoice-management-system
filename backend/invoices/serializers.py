from rest_framework import serializers

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


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


class InvoiceItemSerializer(serializers.ModelSerializer):
    amount = serializers.ReadOnlyField()

    class Meta:
        model = InvoiceItem
        fields = "__all__"


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = "__all__"


class QuoteItemSerializer(serializers.ModelSerializer):
    amount = serializers.ReadOnlyField()

    class Meta:
        model = QuoteItem
        fields = "__all__"


class QuoteSerializer(serializers.ModelSerializer):
    items = QuoteItemSerializer(many=True, read_only=True)

    class Meta:
        model = Quote
        fields = "__all__"


# ---------------- SETTINGS SERIALIZERS ----------------

class GeneralSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralSettings
        fields = "__all__"


class BusinessSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessSettings
        fields = "__all__"


class QuotationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationSettings
        fields = "__all__"


class InvoiceSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceSettings
        fields = "__all__"


class PaymentSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSettings
        fields = "__all__"


class TaxSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxSettings
        fields = "__all__"


class EmailSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailSettings
        fields = "__all__"


class PDFSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFSettings
        fields = "__all__"


class TranslateSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranslateSettings
        fields = "__all__"