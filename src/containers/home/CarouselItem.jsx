import React from "react";
import wallet from "../../assets/wallet.svg";
import flower from "../../assets/flower.svg";
import carouselImage1 from "../../assets/carouselComponentimg1.svg";
import carouselImage2 from "../../assets/hands.svg";

const carouselImg =[carouselImage1,carouselImage2,carouselImage1];
export const CarouselItem = ({ item, width,itemIndex }) => {
    return (
        <div className="carousel-item" style={{ width: width }}>
            <img src={wallet} alt="animationImage" className="wallet-anm anm" />
            <div className="carousel-item-text-section">
            <div className="carousel-item-text">{item.description}</div>
            <div className="carousel-item-text">{item.quote}</div>
            <div className="carousel-item-subtext">{ item.subDescription}</div>
            </div>
            <div className="img-container">
            <img src={flower} alt="animationImage" className="flower-anm anm" />
            <img src={carouselImg[itemIndex]} alt="Carouselimage" className="carouselImage1"/>
            <img className="carousel-img" alt="carasoulimage" src={item.icon.default} />
            </div>
        </div>
    );
};