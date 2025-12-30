import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import {
  About,
  Offerings,
  Whyanupaat,
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
          <Route path="whyanupaat" element={<Whyanupaat />} />
          <Route path="offerings" element={<Offerings />} />
          <Route path="contact" element={<Contact />} />
          <Route path="ourApp" element={<OurApp />} />
          <Route path="appdownload" element={<AppDownload />} />
          <Route path="calculators" element={<Calculators />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
