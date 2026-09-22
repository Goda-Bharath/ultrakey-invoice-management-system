from django.db import models


from django.db import models


# =========================
# CLIENT
# =========================

class Client(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.name


# =========================
# INVOICE
# =========================

class Invoice(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("sent", "Sent"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="invoices"
    )

    invoice_number = models.CharField(
        max_length=50,
        unique=True
    )

    title = models.CharField(
        max_length=200,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    created_date = models.DateField(
        auto_now_add=True
    )

    due_date = models.DateField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    tax = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    notes = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.invoice_number


# =========================
# INVOICE ITEM
# =========================

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name="items"
    )

    item_title = models.CharField(
        max_length=200
    )

    description = models.TextField(
        blank=True
    )

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    taxable = models.BooleanField(
        default=False
    )

    @property
    def amount(self):
        return self.quantity * self.rate

    def __str__(self):
        return self.item_title


# =========================
# QUOTE
# =========================

class Quote(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("sent", "Sent"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="quotes"
    )

    quote_number = models.CharField(
        max_length=50,
        unique=True
    )

    title = models.CharField(
        max_length=200,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    created_date = models.DateField(
        auto_now_add=True
    )

    valid_until = models.DateField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    tax = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    notes = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.quote_number


# =========================
# QUOTE ITEM
# =========================

class QuoteItem(models.Model):
    quote = models.ForeignKey(
        Quote,
        on_delete=models.CASCADE,
        related_name="items"
    )

    item_title = models.CharField(
        max_length=200
    )

    description = models.TextField(
        blank=True
    )

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    taxable = models.BooleanField(
        default=False
    )

    @property
    def amount(self):
        return self.quantity * self.rate

    def __str__(self):
        return self.item_title


# =========================
# GENERAL SETTINGS
# =========================

class GeneralSettings(models.Model):
    year_start = models.CharField(
        max_length=20,
        blank=True
    )

    year_end = models.CharField(
        max_length=20,
        blank=True
    )

    predefined_line_items = models.JSONField(
        default=list,
        blank=True
    )

    def __str__(self):
        return "General Settings"


# =========================
# BUSINESS SETTINGS
# =========================

class BusinessSettings(models.Model):
    business_name = models.CharField(
        max_length=200
    )

    logo = models.ImageField(
        upload_to="business/",
        blank=True,
        null=True
    )

    address = models.TextField(
        blank=True
    )

    extra_info = models.TextField(
        blank=True
    )

    website = models.URLField(
        blank=True
    )

    def __str__(self):
        return self.business_name


# =========================
# QUOTATION SETTINGS
# =========================

class QuotationSettings(models.Model):
    prefix = models.CharField(
        max_length=20,
        default="QUO-"
    )

    suffix = models.CharField(
        max_length=20,
        blank=True
    )

    auto_increment = models.BooleanField(
        default=True
    )

    next_number = models.PositiveIntegerField(
        default=1
    )

    quote_validity = models.PositiveIntegerField(
        default=30
    )

    hide_adjust_field = models.BooleanField(
        default=False
    )

    terms_conditions = models.TextField(
        blank=True
    )

    footer = models.TextField(
        blank=True
    )

    accepting_quotes = models.BooleanField(
        default=True
    )

    accept_decline_settings = models.BooleanField(
        default=True
    )

    admin_notices = models.BooleanField(
        default=True
    )

    template = models.CharField(
        max_length=50,
        default="classic"
    )

    custom_css = models.TextField(
        blank=True
    )

    def __str__(self):
        return "Quotation Settings"


# =========================
# INVOICE SETTINGS
# =========================

class InvoiceSettings(models.Model):
    prefix = models.CharField(
        max_length=20,
        default="INV-"
    )

    suffix = models.CharField(
        max_length=20,
        blank=True
    )

    auto_increment = models.BooleanField(
        default=True
    )

    next_number = models.PositiveIntegerField(
        default=1
    )

    due_days = models.PositiveIntegerField(
        default=30
    )

    hide_adjust_field = models.BooleanField(
        default=False
    )

    terms_conditions = models.TextField(
        blank=True
    )

    footer = models.TextField(
        blank=True
    )

    admin_notices = models.BooleanField(
        default=True
    )

    template = models.CharField(
        max_length=50,
        default="classic"
    )

    custom_css = models.TextField(
        blank=True
    )

    def __str__(self):
        return "Invoice Settings"


# =========================
# PAYMENT SETTINGS
# =========================

class PaymentSettings(models.Model):
    currency_symbol = models.CharField(
        max_length=10,
        default="₹"
    )

    currency_position = models.CharField(
        max_length=20,
        default="before"
    )

    thousand_separator = models.CharField(
        max_length=5,
        default=","
    )

    decimal_places = models.PositiveIntegerField(
        default=2
    )

    payment_page = models.BooleanField(
        default=True
    )

    payment_footer = models.TextField(
        blank=True
    )

    bank_details = models.TextField(
        blank=True
    )

    generic_payment = models.BooleanField(
        default=True
    )

    paypal_enabled = models.BooleanField(
        default=False
    )

    def __str__(self):
        return "Payment Settings"


# =========================
# TAX SETTINGS
# =========================

class TaxSettings(models.Model):
    prices_include_tax = models.BooleanField(
        default=False
    )

    tax_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    tax_name = models.CharField(
        max_length=100,
        default="GST"
    )

    def __str__(self):
        return "Tax Settings"


# =========================
# EMAIL SETTINGS
# =========================

class EmailSettings(models.Model):
    email_address = models.EmailField(
        blank=True
    )

    email_name = models.CharField(
        max_length=200,
        blank=True
    )

    quote_available = models.BooleanField(
        default=True
    )

    invoice_available = models.BooleanField(
        default=True
    )

    payment_received = models.BooleanField(
        default=True
    )

    payment_reminder = models.BooleanField(
        default=True
    )

    quote_template = models.TextField(
        blank=True
    )

    invoice_template = models.TextField(
        blank=True
    )

    payment_template = models.TextField(
        blank=True
    )

    reminder_template = models.TextField(
        blank=True
    )

    def __str__(self):
        return "Email Settings"


# =========================
# PDF SETTINGS
# =========================

class PDFSettings(models.Model):
    template = models.CharField(
        max_length=50,
        default="classic"
    )

    custom_css = models.TextField(
        blank=True
    )

    def __str__(self):
        return "PDF Settings"


# =========================
# TRANSLATE SETTINGS
# =========================

class TranslateSettings(models.Model):
    language = models.CharField(
        max_length=50,
        default="English"
    )

    invoice_title = models.CharField(
        max_length=100,
        default="Invoice"
    )

    quote_title = models.CharField(
        max_length=100,
        default="Quotation"
    )

    client_label = models.CharField(
        max_length=100,
        default="Client"
    )

    subtotal_label = models.CharField(
        max_length=100,
        default="Subtotal"
    )

    tax_label = models.CharField(
        max_length=100,
        default="Tax"
    )

    total_label = models.CharField(
        max_length=100,
        default="Total"
    )

    def __str__(self):
        return "Translate Settings"