import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../containers/footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ChatBot from "../components/chatbot/ChatBot";
import WhatsAppCTA from "../components/WhatsAppCTA/WhatsAppCTA";
import MarketTicker from "../components/MarketTicker/MarketTicker";
import { MARKET_COMPASS_LOGIN_PATH } from "../data/insightTools";

const MainLayout = () => {
    const { pathname } = useLocation();
    const isCompassEmbed = pathname === MARKET_COMPASS_LOGIN_PATH;

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <MarketTicker />
            <main className={`layout-outlet${isCompassEmbed ? ' layout-outlet--embed' : ''}`}>
                <Outlet />
            </main>
            {isCompassEmbed ? null : (
                <>
                    <Footer />
                    <ScrollToTopButton />
                    <ChatBot />
                    <WhatsAppCTA />
                </>
            )}
        </>
    );
};

export default MainLayout;
