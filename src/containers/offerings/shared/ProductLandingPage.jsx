import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../offerings-shared.css';
import './productLanding.css';

export default function ProductLandingPage({ product }) {
  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} | Anupaat Nivesh`;
    }
  }, [product]);

  if (!product) {
    return (
      <div className="section__padding">
        <p>Product not found.</p>
        <Link to="/fixed-income-alternatives">Back to Fixed Income & Alternatives</Link>
      </div>
    );
  }

  return (
    <div className="product-landing section__padding">
      <p className="product-landing__back">
        <Link to="/fixed-income-alternatives">← Fixed Income & Alternatives</Link>
      </p>

      <div className="product-landing__hero">
        <div data-aos="fade-right">
          {product.status === 'coming_soon' && (
            <span className="product-landing__status">Coming soon</span>
          )}
          <h1 className="primary-heading">{product.title}</h1>
          <p className="product-landing__tagline">{product.tagline}</p>
          <p className="product-landing__intro">{product.description}</p>
          <div className="offerings-cta product-landing__cta">
            <Link
              to={product.ctaPath || '/book-consultation'}
              className="offerings-btn offerings-btn--primary"
            >
              {product.ctaLabel || 'Book consultation'}
            </Link>
            <Link to="/contact" className="offerings-btn offerings-btn--secondary">
              Contact us
            </Link>
          </div>
        </div>
        <div className="product-landing__hero-img" data-aos="fade-left">
          {product.illustration && (
            <img src={product.illustration} alt="" className="hero-illustration" />
          )}
        </div>
      </div>

      <section className="product-landing__section">
        <p className="product-landing__eyebrow">Why consider it</p>
        <h2 className="invest-product-section-title product-landing__section-title">Key benefits</h2>
        <div className="product-landing__benefits">
          {product.benefits.map((b, i) => (
            <article key={b.heading} className="product-landing__benefit-card" data-aos="fade-up">
              <span className="product-landing__benefit-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{b.heading}</h3>
              <p>{b.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="product-landing__ideal">
        <div className="product-landing__ideal-head">
          <div>
            <p className="product-landing__eyebrow">Investor fit</p>
            <h2 className="invest-product-section-title product-landing__section-title">Who is it for?</h2>
            <p className="product-landing__ideal-lead">
              A quick checklist to see if {product.title} aligns with your goals and risk comfort.
            </p>
          </div>
        </div>
        <ul className="product-landing__ideal-grid">
          {product.idealFor.map((item) => (
            <li key={item} className="product-landing__ideal-item">
              <span className="product-landing__ideal-check" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="product-landing__consult">
        <div className="product-landing__consult-copy">
          <h2>Not sure if this fits?</h2>
          <p>
            Book a consultation — we walk through liquidity, tax, and partner terms before you
            commit.
          </p>
        </div>
        <div className="offerings-cta product-landing__consult-cta">
          <Link
            to={product.ctaPath || '/book-consultation'}
            className="offerings-btn offerings-btn--primary"
          >
            {product.ctaLabel || 'Book consultation'}
          </Link>
          <Link to="/contact" className="offerings-btn offerings-btn--secondary">
            Contact us
          </Link>
        </div>
      </aside>

      {product.crossLinks?.length > 0 && (
        <div className="product-landing__crosslinks">
          <span>Related:</span>
          {product.crossLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              {link.label} →
            </Link>
          ))}
        </div>
      )}

      <aside className="product-landing__disclaimer" role="note">
        <span className="product-landing__disclaimer-icon" aria-hidden="true">
          i
        </span>
        <p>
          This page is for education and discovery only. It is not investment advice. Product
          availability, rates, and terms depend on partner institutions and applicable regulations.
          Consult your financial advisor before investing.
        </p>
      </aside>
    </div>
  );
}
