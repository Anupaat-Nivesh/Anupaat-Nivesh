import React from "react";

export const CarouselItem = ({item}) => {
    return (
        <div className="carousel-item">

            <div className="carousel-item-text-section " data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine">
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