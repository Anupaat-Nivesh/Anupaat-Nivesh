import React from "react";

export const CarouselItem = ({ item, width, itemIndex }) => {
    return (
        <div className="carousel-item">

            <div className="carousel-item-text-section">
                <div className="carousel-item-text">{item.description}
                <span className="bold-text">{item.bold}</span>
                </div>
                
                <div className="carousel-item-subDes"><q>{item.subDescription}</q></div>
                <div className="carousel-item-subtext">{item.subText}</div>

            </div>
            <div className="img-container">
                <img className="carousel-img" alt="carasoulimage" src={item.img} />
            </div>
        </div>
    );
};