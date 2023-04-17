import React from "react";


export const CarouselItem = ({ item }) => {


    return (
        <div className="carousel-item">

            <div className="carousel-item-text-section ">
                <div className="carousel-item-text">{item.description}
                    <span className="bold-text">{item.bold}</span>
                </div>

                <div className="carousel-item-subDes"><q>{item.subDescription}</q></div>
                <div className="carousel-item-subtext">{item.subText}</div>

            </div>
            <div className="img-container">
                <picture>
                    <source srcSet={item.img} type="image/webp" />
                    <source srcSet={item.preimg} type="image/webp" />
                    <img className="carousel-img" alt="carasoulimage" src={item.img} />
                </picture>
            </div>
        </div>
    );
};