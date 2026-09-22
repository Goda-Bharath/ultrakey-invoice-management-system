from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ClientViewSet,
    InvoiceViewSet,
    InvoiceItemViewSet,
    QuoteViewSet,
    QuoteItemViewSet,
    GeneralSettingsViewSet,
    BusinessSettingsViewSet,
    QuotationSettingsViewSet,
    InvoiceSettingsViewSet,
    PaymentSettingsViewSet,
    TaxSettingsViewSet,
    EmailSettingsViewSet,
    PDFSettingsViewSet,
    TranslateSettingsViewSet,
    register_user,
    login_user,
)

router = DefaultRouter()

# Main APIs
router.register(r"clients", ClientViewSet)
router.register(r"invoices", InvoiceViewSet)
router.register(r"invoice-items", InvoiceItemViewSet)
router.register(r"quotes", QuoteViewSet)
router.register(r"quote-items", QuoteItemViewSet)

# Settings APIs
router.register(r"general-settings", GeneralSettingsViewSet)
router.register(r"business-settings", BusinessSettingsViewSet)
router.register(r"quotation-settings", QuotationSettingsViewSet)
router.register(r"invoice-settings", InvoiceSettingsViewSet)
router.register(r"payment-settings", PaymentSettingsViewSet)
router.register(r"tax-settings", TaxSettingsViewSet)
router.register(r"email-settings", EmailSettingsViewSet)
router.register(r"pdf-settings", PDFSettingsViewSet)
router.register(r"translate-settings", TranslateSettingsViewSet)

urlpatterns = [
    path("register/", register_user, name="register"),
    path("login/", login_user, name="login"),
]

urlpatterns += router.urls