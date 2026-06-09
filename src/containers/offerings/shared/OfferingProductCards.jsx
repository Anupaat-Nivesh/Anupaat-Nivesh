import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import './offeringProduct.css';

const OfferingProductCards = ({ sectionTitle, sectionSubtitle, cardsData }) => {
  return (
    <>
      <div className="offering-product__card-container">
        <div className="offering-product-cards-title">
          <h1>{sectionTitle}</h1>
          {sectionSubtitle && <p className="lead">{sectionSubtitle}</p>}
        </div>
        <div className="offering-product-card-grid">
          {cardsData.map(({ icon, title, description, color }, id) => (
            <Card
              className="offering-product_data"
              key={id}
              style={{ backgroundColor: color }}
              data-name={title}
            >
              <div className="card-img">
                <img src={icon} alt="" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="offering-product-bottom-cta section__padding">
        <p className="offering-product-disclaimer">
          Returns are not guaranteed. Product suitability depends on your goals,
          risk profile, and liquidity needs. Partner and issuer terms apply.
        </p>
        <div className="offering-product-btn">
          <Link to="/contact" className="btn">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
};

export default OfferingProductCards;
