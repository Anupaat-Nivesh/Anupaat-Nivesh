import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../containers/footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ChatBot from "../components/chatbot/ChatBot";
import WhatsAppCTA from "../components/WhatsAppCTA/WhatsAppCTA";
import MarketTicker from "../components/MarketTicker/MarketTicker";
import { isEmbeddedToolPath } from "../data/insightTools";

const MainLayout = () => {
    const { pathname } = useLocation();
    // Trailing slash (Hostinger dir mirrors) must still count as embed.
    const isToolEmbed = isEmbeddedToolPath(pathname);

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <MarketTicker />
            <main className={`layout-outlet${isToolEmbed ? ' layout-outlet--embed' : ''}`}>
                <Outlet />
            </main>
            {isToolEmbed ? null : (
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
