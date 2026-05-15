import React from "react";
import { Link } from "react-router-dom";


export const CarouselItem = ({ item }) => {


    return (
        <div className="carousel-item">

            <div className="carousel-item-text-section ">
                <div className="carousel-item-text">{item.description}
                    <span className="bold-text">{item.bold}</span>
                </div>

                <div className="carousel-item-subDes"><q>{item.subDescription}</q></div>
                <div className="carousel-item-subtext">{item.subText}</div>
                {item.ctaPath && item.ctaLabel ? (
                    <div className="carousel-item-cta-row">
                        <Link to={item.ctaPath} className="carousel-cta-btn carousel-cta-btn--outline">
                            {item.ctaLabel}
                        </Link>
                    </div>
                ) : null}

            </div>
            <div className="img-container">
                
                    <img className="carousel-img" alt="carasoulimage" src={item.img} srcSet={`${item.img560w} 560w, ${item.img1120w} 1120w`} sizes="(min-width: 1380px) 1120px, (min-width: 1280px) calc(62.5vw - 290px), (min-width: 720px) calc(44.81vw - 55px), (min-width: 560px) calc(80vw - 80px), calc(100vw - 80px)" />
            </div>
        </div>
    );
};
