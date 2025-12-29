import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../containers/footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ChatBot from "../components/chatbot/ChatBot";

const MainLayout = () => {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Outlet />
            <Footer />
            <ScrollToTopButton />
            <ChatBot />
        </>
    );
};

export default MainLayout;
