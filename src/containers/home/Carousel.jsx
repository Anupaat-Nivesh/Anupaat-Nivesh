import React, { useRef, useState } from "react";
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
            preimg: require("../../assets/illustrations/pre-carousel1-illustration.webp"),
            img: require("../../assets/illustrations/carousel1-illustration.webp"),
        },
        {
            id: 2,
            title: "Savings",
            description: "Looking for ",
            bold: 'Financial Freedom',
            subDescription: "When it comes to long-term investing, doing 'LESS' is often 'MORE'.",
            subText: "Start SIP to meet your long-term financial goals",
            preimg: require("../../assets/illustrations/pre-carousel2-illustration.webp"),
            img: require("../../assets/illustrations/carousel2-illustration.webp"),
        },
        {
            id: 3,
            title: "Stocks",
            description: "Be a part of the next ",
            bold: 'Investment Wave',
            subDescription: "You will make big money if you don't go behind quick money.",
            subText: "Subscribe to our curated Equity Baskets & be ahead in your investment journey",
            preimg: require("../../assets/illustrations/pre-carousel3-illustration.webp"),
            img: require("../../assets/illustrations/carousel3-illustration.webp"),
        },
        {
            id: 4,
            title: "KAIZEN",
            description: "Start with ",
            bold: 'KAIZEN SIP',
            subDescription: "Sometime just a small step is required to start of the journey",
            subText: "Because we know, slow and steady wins the race",
            preimg: require("../../assets/illustrations/pre-carousel4-illustration.webp"),
            img: require("../../assets/illustrations/carousel4-illustration.webp")

        }
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

            navigation={false} grabCursor={true} pagination={{
                clickable: true,
            }} modules={[Navigation, Pagination, Autoplay]}
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