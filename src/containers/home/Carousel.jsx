import React, { useState } from "react";
import './carousel.css';
import { CarouselItem } from "./CarouselItem";

export const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {
            title: "Investment",
            description:"Let's get you started with", 
            bold:" INVESTING!",
            subDescription: "High income does not lead to wealth. It is high savings with right Investment.",
            subText: "Stack up with your financial foundation and get personalized advisory",

            icon: require("../../assets/illustrations/investor.svg"),
        },
        {
            title: "Savings",
            description: "Looking for ",
            bold:'Financial Freedom',
            subDescription: "When it comes to long-term investing, doing 'LESS' is often 'MORE'.",
            subText: "Start SIP to meet your long-term financial goals",

            icon: require("../../assets/illustrations/savings.svg"),
        },
        {
            title: "Stocks",
            description:"Be a part of the next ",
            bold:'Investment Wave',
            subDescription: "You will make big money if you don't go behind quick money.",
            subText: "Subscribe to our curated Equity Baskets & be ahead in your investment journey",
            icon: require("../../assets/illustrations/stocks.svg"),
        },
    ];
    function updateIndex(newIndex) {
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= items.length) {
            newIndex = items.length - 1;
        }

        setActiveIndex(newIndex);
    }



    return (
        <div className="carousel">
            <div
                className="inner"
                style={{
                    transform: `translate(-${activeIndex * 100}%)`
                }}
            >
                {items.map((item) => {
                    return <CarouselItem item={item} width={"100%"} itemIndex={activeIndex} />;
                })}
            </div>

            <div className="carousel-buttons">

                <div className="indicators">
                    {items.map((item, index) => {
                        return (
                            <button
                                className="indicator-buttons"
                                onClick={() => {
                                    updateIndex(index);
                                }}
                            >
                                <span
                                    className={`material-symbols-outlined ${index === activeIndex
                                        ? "indicator-symbol-active"
                                        : "indicator-symbol"
                                        }`}
                                >
                                    radio_button_checked
                                </span>
                            </button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};