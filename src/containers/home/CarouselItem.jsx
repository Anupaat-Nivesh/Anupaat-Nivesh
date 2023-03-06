import React from "react";
import wallet from "../../assets/wallet.svg";
import flower from "../../assets/flower.svg";
import carouselImage1 from "../../assets/carouselComponentimg1.svg";

export const CarouselItem = ({ item, width }) => {
    return (
        <div className="carousel-item" style={{ width: width }}>
            <div></div>
            <img src={wallet} alt="animationImage" className="wallet-anm anm" />
            <div className="carousel-item-subtext">{ }</div>
            <div className="carousel-item-text">{item.description}</div>
            <div className="img-container">
            <img src={flower} alt="animationImage" className="flower-anm anm" />
            <img src={carouselImage1} alt="Carouselimage" className="carouselImage1" />
            <img className="carousel-img" alt="carasoulimage" src={item.icon.default} />
            </div>
        </div>
    );
};