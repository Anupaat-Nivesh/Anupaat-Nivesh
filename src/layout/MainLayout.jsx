import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../containers/footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ChatBot from "../components/chatbot/ChatBot";
import WhatsAppCTA from "../components/WhatsAppCTA/WhatsAppCTA";
import MarketTicker from "../components/MarketTicker/MarketTicker";

const MainLayout = () => {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <MarketTicker />
            <main className="layout-outlet">
                <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
            <ChatBot />
            <WhatsAppCTA />
        </>
    );
};

export default MainLayout;
