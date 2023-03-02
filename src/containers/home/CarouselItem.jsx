import React from "react";

export const CarouselItem = ({ item, width }) => {
    return (
        <div className="carousel-item" style={{ width: width }}>
            <div></div>
            <div className="carousel-item-subtext">{ }</div>
            <div className="carousel-item-text">{item.description}</div>
            <img className="carousel-img" src={item.icon.default} />


        </div>
    );
};