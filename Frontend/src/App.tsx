import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Khata from './pages/Khata/Khata';
import KhataDetail from './pages/KhataDetail/KhataDetail';
import Billing from './pages/Billing/Billing';
import Inventory from './pages/Inventory/Inventory';
import Payments from './pages/Payments/Payments';
import Staff from './pages/Staff/Staff';
import AI from './pages/AI/AI';
import Store from './pages/Store/Store';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Community from './pages/Community/Community';
import Vouchers from './pages/Vouchers/Vouchers';
import Subscription from './pages/Subscription/Subscription';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Success from './pages/Success/Success';
import PaymentFailure from './pages/Failure/PaymentFailure';
import OTPVerify from './pages/OTPVerify/OTPVerify';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import Reminders from './pages/Reminders/Reminders';
import DigitalKhata from './pages/DigitalKhata/DigitalKhata';
import CustomerLedger from './pages/DigitalKhata/CustomerLedger';
import { Vendors, VendorDetail } from './pages/Vendors';
import Campaigns from './pages/Campaigns/Campaigns';

import NewInvoice from './pages/Billing/NewInvoice';


// Footer & Info Pages
import About from './pages/about/about';
import Contact from './pages/contact/contact';
import Careers from './pages/careers/careers';
import Blog from './pages/blog/blog';
import PressKit from './pages/press-kit/press-kit';
import Features from './pages/features/features';
import PricingPage from './pages/pricing/pricing';
import Security from './pages/security/security';
import Updates from './pages/updates/updates';
import Changelog from './pages/changelog/changelog';
import HelpCenter from './pages/help-center/help-center';
import Guides from './pages/guides/guides';
import HowItWorks from './pages/how-it-works/how-it-works';
import BusinessTips from './pages/business-tips/business-tips';
import APIDocs from './pages/api-docs/api-docs';
import PrivacyPolicy from './pages/privacy-policy/privacy-policy';
import TermsAndConditions from './pages/terms-and-conditions/terms-and-conditions';
import RefundPolicy from './pages/refund-policy/refund-policy';
import SecurityPolicy from './pages/security-policy/security-policy';
import Compliance from './pages/compliance/compliance';
import Integrations from './pages/integrations/integrations';
import ClickSpark from './components/ui/ClickSpark/ClickSpark';
import SplashCursor from './components/ui/SplashCursor/SplashCursor';


export default function App() {
  return (
    <ClickSpark
      sparkColor='#FF6B00'
      sparkSize={10}
      sparkRadius={20}
      sparkCount={10}
      duration={400}
    >
      <SplashCursor />
      <Routes>
        {/* ... existing routes ... */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/success" element={<Success />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/verify-otp" element={<OTPVerify />} />

        {/* Info & Legal Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/press-kit" element={<PressKit />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<Security />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/business-tips" element={<BusinessTips />} />
        <Route path="/api-docs" element={<APIDocs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/security-policy" element={<SecurityPolicy />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/integrations" element={<Integrations />} />

        {/* Authenticated App Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Khata / Ledger */}
          <Route path="/khata" element={<DigitalKhata />} />
          <Route path="/khata/:id" element={<CustomerLedger />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<VendorDetail />} />
          <Route path="/dashboard/digital-khata" element={<DigitalKhata />} />
          <Route path="/dashboard/digital-khata/:id" element={<CustomerLedger />} />

          {/* Invoices */}
          <Route path="/invoices" element={<Billing />} />
          <Route path="/invoices/new" element={<NewInvoice />} />

          {/* Inventory */}
          <Route path="/inventory" element={<Inventory />} />

          {/* Payments */}
          <Route path="/payments" element={<Payments />} />

          {/* Staff */}
          <Route path="/staff" element={<Staff />} />

          {/* AI */}
          <Route path="/ai" element={<AI />} />

          {/* Online Store */}
          <Route path="/store" element={<Store />} />
          <Route path="/online-store" element={<Store />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* Campaigns */}
          <Route path="/campaigns" element={<Campaigns />} />

          {/* Vouchers */}
          <Route path="/vouchers" element={<Vouchers />} />

          {/* Community */}
          <Route path="/community" element={<Community />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Subscription */}
          <Route path="/subscription" element={<Subscription />} />
          
          {/* WhatsApp Reminders */}
          <Route path="/reminders" element={<Reminders />} />
        </Route>

        {/* Admin Control Center - Dedicated Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ClickSpark>
  );
}
