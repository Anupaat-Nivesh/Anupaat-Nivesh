import React, { useState } from "react";
import './carousel.css';
import { CarouselItem } from "./CarouselItem";

export const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        {
            title: "Investment",
            description:
                "An Investment Solution For Every Need ",
            icon: require("../../assets/illustrations/investor.svg"),
        },
        {
            title: "Savings",
            description:
                "We Help You Create A Plan ",
            icon: require("../../assets/illustrations/savings.svg"),
        },
        {
            title: "Stocks",
            description:
                "Invest Today for the Future Use",
            icon: require("../../assets/illustrations/stocks.svg"),
        },
    ];
    const updateIndex = (newIndex) => {
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= items.length) {
            newIndex = items.length - 1;
        }

        setActiveIndex(newIndex);
    };



    return (
        <div className="carousel">
            <div 
                className="inner"
                style={{
                    transform: `translate(-${activeIndex * 100}%)`
                }}
            >
                {items.map((item) => {
                    return <CarouselItem item={item} width={"100%"} />;
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