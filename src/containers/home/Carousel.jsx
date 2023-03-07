import React, { useState } from "react";
import './carousel.css';
import { CarouselItem } from "./CarouselItem";

export const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {
            title: "Investment",
            description:
                "Let's get you started with INVESTING!  stack up with your financial foundation and get personalized recommendations",
            icon: require("../../assets/illustrations/investor.svg"),
        },
        {
            title: "Savings",
            description:
                " Looking for Financial Freedom. Start your SIP with us and get personlized consulting for your asset allocation",
            icon: require("../../assets/illustrations/savings.svg"),
        },
        {
            title: "Stocks",
            description:
                "Be a part of the next INVESTMENT wave - Subscribe to our curated Equity Baskets & be ahead in your investment journey",
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