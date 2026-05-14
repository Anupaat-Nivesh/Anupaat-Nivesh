import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import {
  About,
  Offerings,
  Home,
  FAQs,
  Privacypolicy,
  MutualFund,
  EquityBasket,
  LoanAgainstSecurities,
  Calculators,
} from "./containers";
import {
  NotFound,
  Contact,
  OurApp,
  PartnerWithUs,
  CorporateCorner,
} from "./components";
import AppDownload from "./components/AppDownload/AppDownload";
import AOS from "aos";
import "aos/dist/aos.css";

import "./App.css";
import Tools from './containers/tools/Tools';
import ChatBotPage from './pages/ChatBotPage';
import ConsultingSession from './pages/ConsultingSession/ConsultingSession';
import Booking from './pages/Booking/Booking';
import BookingWizardPage from './pages/BookingWizard/BookingWizardPage';
import Payment from './pages/Payment/Payment';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import PaymentError from './pages/PaymentError/PaymentError';
import BookConsultationMobile from './pages/BookConsultationMobile/BookConsultationMobile';
import Onboarding from "./pages/Onboarding/Onboarding";
import SignupPage from "./pages/Signup/Signup";
import AdminMediaPanel from "./pages/AdminMediaPanel/AdminMediaPanel";
import { BasketUserProvider } from "./basket/context/BasketUserContext";
import BasketLayout from "./basket/layout/BasketLayout";
import BasketLanding from "./basket/pages/BasketLanding";
import BasketDetail from "./basket/pages/BasketDetail";
import RiskProfilePage from "./basket/pages/RiskProfilePage";
import GoalGPSPage from "./basket/pages/GoalGPSPage";
import BasketDashboardPage from "./basket/pages/BasketDashboardPage";
import BasketPaymentSuccessPage from "./basket/pages/BasketPaymentSuccessPage";
import BasketAdminPage from "./basket/pages/BasketAdminPage";

import { useEffect } from "react";


function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-in-out",
    });
  }, []);
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          {/* Why Anupaat Nivesh content is now merged into the About page.
              Redirect any old /whyanupaat links so external bookmarks keep working. */}
          <Route path="whyanupaat" element={<Navigate to="/about" replace />} />
          <Route path="offerings" element={<Offerings />} />
          <Route path="contact" element={<Contact />} />
          <Route path="ourApp" element={<OurApp />} />
          <Route path="appdownload" element={<AppDownload />} />
          <Route path="calculators" element={<Calculators />} />
          <Route path="consulting-session" element={<ConsultingSession />} />
          <Route path="booking" element={<Booking />} />
          <Route path="book-session" element={<BookingWizardPage />} />
          <Route path="payment" element={<Payment />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-error" element={<PaymentError />} />
          <Route path="signup" element={<SignupPage />} />

          <Route path="*" element={<NotFound />} />
          {/* footer pages  */}
          <Route path="faqs" element={<FAQs />} />
          <Route path="partner-with-us" element={<PartnerWithUs />} />
          <Route path="corporate" element={<CorporateCorner />} />

          <Route path="privacy-policy" element={<Privacypolicy />} />

          {/* Offering pages  */}
          <Route path="mutual-funds" element={<MutualFund />} />
          <Route path="equity-basket" element={<EquityBasket />} />
          <Route
            path="loan-against-securities"
            element={<LoanAgainstSecurities />}
          />
          <Route path="/tools" element={<Tools />} />
        </Route>
        {/* Standalone Chatbot Page - ArthAI */}
        <Route path="/ArthAI" element={<ChatBotPage />} />
        {/* Legacy route for backward compatibility */}
        <Route path="/chatbot" element={<ChatBotPage />} />
        {/* Standalone Mobile Booking Funnel - No MainLayout */}
        <Route path="/book-consultation" element={<BookConsultationMobile />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/internal/media-library" element={<AdminMediaPanel />} />
        <Route path="/mediadata" element={<AdminMediaPanel />} />

        {/* Elemental Basket Investing Platform */}
        <Route
          path="/invest"
          element={
            <BasketUserProvider>
              <BasketLayout />
            </BasketUserProvider>
          }
        >
          <Route index element={<BasketLanding />} />
          <Route path="basket/:id" element={<BasketDetail />} />
          <Route path="risk-profile" element={<RiskProfilePage />} />
          <Route path="goals" element={<GoalGPSPage />} />
          <Route path="dashboard" element={<BasketDashboardPage />} />
          <Route path="payment-success" element={<BasketPaymentSuccessPage />} />
          <Route path="admin" element={<BasketAdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
