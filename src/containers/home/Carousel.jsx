import React from "react";
import './carousel.css';
import { CarouselItem } from "./CarouselItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const Carousel = () => {

    const items = [
        {
            id: 1,
            title: "Investment",
            description: "Let's get you started with",
            bold: " INVESTING!",
            subDescription: "High income does not lead to wealth. It is high savings with right Investment.",
            subText: "Stack up with your financial foundation and get personalized advisory",
            img560w: require("../../assets/illustrations/carousel1-illustration-560w.webp"),
            img1120w: require("../../assets/illustrations/carousel1-illustration-1120w.webp"),
            img: require("../../assets/illustrations/carousel1-illustration.webp"),
        },
        {
            id: 2,
            title: "Savings",
            description: "Looking for ",
            bold: 'Financial Freedom',
            subDescription: "When it comes to long-term investing, doing 'LESS' is often 'MORE'.",
            subText: "Start SIP to meet your long-term financial goals",
            img560w: require("../../assets/illustrations/carousel2-illustration-560w.webp"),
            img1120w: require("../../assets/illustrations/carousel2-illustration-1120w.webp"),
            img: require("../../assets/illustrations/carousel2-illustration.webp"),
        },
        {
            id: 3,
            title: "MarketCompass",
            description: "Deploy with ",
            bold: "probability, not noise",
            subDescription:
                "The same valuation evidence others skim — normalized, de-noised, and read as a single deployment posture for fresh money.",
            subText: "Lump sum vs STP, sleeves, and risk bands — not forecasts. Coming soon on Anupaat Nivesh.",
            ctaPath: "/valuation",
            ctaLabel: "See how it works",
            img560w: require("../../assets/illustrations/carousel1-illustration-560w.webp"),
            img1120w: require("../../assets/illustrations/carousel1-illustration-1120w.webp"),
            img: require("../../assets/illustrations/carousel1-illustration.webp"),
        },
        {
            id: 4,
            title: "Stocks",
            description: "Be a part of the next ",
            bold: 'Investment Wave',
            subDescription: "You will make big money if you don't go behind quick money.",
            subText: "Subscribe to our curated Equity Baskets & be ahead in your investment journey",
            img560w: require("../../assets/illustrations/carousel3-illustration-560w.webp"),
            img1120w: require("../../assets/illustrations/carousel3-illustration-1120w.webp"),
            img: require("../../assets/illustrations/carousel3-illustration.webp"),
        },
    ];

    return (
        <Swiper
            spaceBetween={50}
            slidesPerView={1}
            loop={true}
            autoplay={{
                delay: 5000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true
            }}
            navigation={false}
            grabCursor={true}
            pagination={{
                clickable: true,
            }}
            modules={[Navigation, Pagination, Autoplay]}
            className="carousel-swiper"
        >
            {items.map((item) => {
                return <SwiperSlide className="carousel-swiper-slide" key={item.id}>
                    <CarouselItem item={item} width={"100%"} />
                </SwiperSlide>
            })}
        </Swiper>
    );
};
