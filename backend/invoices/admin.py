from django.contrib import admin
from .models import Client, Invoice, InvoiceItem, Quote, QuoteItem


from django.contrib import admin

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


admin.site.register(Client)
admin.site.register(Invoice)
admin.site.register(InvoiceItem)
admin.site.register(Quote)
admin.site.register(QuoteItem)

admin.site.register(GeneralSettings)
admin.site.register(BusinessSettings)
admin.site.register(QuotationSettings)
admin.site.register(InvoiceSettings)
admin.site.register(PaymentSettings)
admin.site.register(TaxSettings)
admin.site.register(EmailSettings)
admin.site.register(PDFSettings)
admin.site.register(TranslateSettings)