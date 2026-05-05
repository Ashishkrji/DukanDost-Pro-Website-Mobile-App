import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "customers": "Customers",
      "suppliers": "Suppliers",
      "inventory": "Inventory",
      "billing": "Billing",
      "settings": "Settings",
      "udhaar": "Credit (Udhaar)",
      "payment": "Payment",
      "len-den": "Credit Ledger",
      "add_customer": "Add Customer",
      "add_supplier": "Add Supplier",
      "total_balance": "Total Balance",
      "low_stock": "Low Stock",
      "health_score": "Business Health",
      "welcome": "Welcome to DukanDost Pro",
      "barcode_scan": "Scan Barcode",
      "pay_via_upi": "Pay via UPI",
      "dena_hai": "Payable (Dena Hai)",
      "lena_hai": "Receivable (Lena Hai)"
    }
  },
  hi: {
    translation: {
      "dashboard": "डैशबोर्ड",
      "customers": "ग्राहक",
      "suppliers": "सप्लायर",
      "inventory": "स्टॉक",
      "billing": "बिलिंग",
      "settings": "सेटिंग्स",
      "udhaar": "उधार",
      "payment": "पेमेंट",
      "len-den": "खाता लेजर",
      "add_customer": "ग्राहक जोड़ें",
      "add_supplier": "सप्लायर जोड़ें",
      "total_balance": "कुल बैलेंस",
      "low_stock": "स्टॉक कम है",
      "health_score": "बिज़नेस हेल्थ",
      "welcome": "दुकानदोस्त प्रो में आपका स्वागत है",
      "barcode_scan": "बारकोड स्कैन करें",
      "pay_via_upi": "UPI से पेमेंट करें",
      "dena_hai": "देना है",
      "lena_hai": "लेना है"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
