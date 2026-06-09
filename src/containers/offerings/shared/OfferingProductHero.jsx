import React from 'react';
import { Link } from 'react-router-dom';
import './offeringProduct.css';

const OfferingProductHero = ({
  primaryHeading,
  focusWord,
  subheading,
  description,
  illustration,
  illustrationAlt = '',
}) => {
  return (
    <div className="offering-product-hero-section section__padding">
      <div className="offering-product-title">
        <h1 className="primary-heading">
          {primaryHeading}{' '}
          <span className="section-heading-focus">{focusWord}</span>
        </h1>
      </div>
      <div className="offering-product-main">
        <div className="offering-product-heading">
          <div
            className="anupaat_whyanupaat-heading-explanation"
            data-aos="zoom-in-right"
            data-aos-duration="1000"
          >
            <div className="whyanupaat-subheading">
              <h2 className="secondary-heading">{subheading}</h2>
            </div>
            <div className="offering-product-description">
              <p>{description}</p>
            </div>
            <div className="offering-product-btn">
              <Link to="/contact" className="btn">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <div
          className="offering-product-image"
          data-aos="zoom-in-left"
          data-aos-duration="1000"
        >
          <picture>
            <img src={illustration} alt={illustrationAlt || focusWord} />
          </picture>
        </div>
      </div>
    </div>
  );
};

export default OfferingProductHero;
