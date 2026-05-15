import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../containers/footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ChatBot from "../components/chatbot/ChatBot";
import WhatsAppCTA from "../components/WhatsAppCTA/WhatsAppCTA";
import MarketTicker from "../components/MarketTicker/MarketTicker";

const MainLayout = () => {
    const { pathname } = useLocation();
    const showMarketTicker = pathname === "/" || pathname === "/home";

    return (
        <>
            <ScrollToTop />
            <Navbar />
            {showMarketTicker ? <MarketTicker /> : null}
            <Outlet />
            <Footer />
            <ScrollToTopButton />
            <ChatBot />
            <WhatsAppCTA />
        </>
    );
};

export default MainLayout;
