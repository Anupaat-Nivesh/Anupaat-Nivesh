import React from "react";
import wallet from "../../assets/wallet.svg";
import flower from "../../assets/flower.svg";
import carouselImage1 from "../../assets/carouselComponentimg1.svg";
import carouselImage2 from "../../assets/hands.svg";

const carouselImg = [carouselImage1, carouselImage2, carouselImage1];
export const CarouselItem = ({ item, width, itemIndex }) => {
    return (
        <div className="carousel-item" style={{ width: width }}>

            <div className="carousel-item-text-section">
                <div className="carousel-item-text">{item.description}</div>
                <div className="carousel-item-subDes"><q>{item.subDescription}</q></div>
                <div className="carousel-item-subtext">{item.subText}</div>

            </div>
            <div className="img-container">

                <img src={carouselImg[itemIndex]} alt="Carouselimage" className="carouselImage1" />
                <img className="carousel-img" alt="carasoulimage" src={item.icon.default} />
            </div>
        </div>
    );
};