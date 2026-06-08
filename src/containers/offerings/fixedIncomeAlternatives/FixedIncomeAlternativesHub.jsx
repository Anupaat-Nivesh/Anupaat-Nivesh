import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES, getProductsByCategory } from '../../../data/investProducts';
import financeIllustration from '../../../assets/illustrations/finance-01.svg';
import '../offerings-shared.css';
import './fixedIncomeAlternatives.css';

function ProductCard({ product }) {
  return (
    <Link to={product.route} className="invest-flow-card">
      {product.status === 'coming_soon' && (
        <span className="invest-flow-badge">Coming soon</span>
      )}
      <h3>{product.title}</h3>
      <p>{product.tagline}</p>
      <span className="invest-flow-link">Learn more →</span>
    </Link>
  );
}

export default function FixedIncomeAlternativesHub() {
  useEffect(() => {
    document.title = 'Fixed Income & Alternatives | Anupaat Nivesh';
  }, []);

  const fixedIncome = getProductsByCategory('fixed_income');
  const alternatives = getProductsByCategory('alternatives');

  return (
    <div id="fixed-income-alternatives" className="fia-hub section__padding">
      <div className="fia-hub__hero">
        <div className="fia-hub__hero-copy" data-aos="fade-right">
          <h1 className="primary-heading">
            Fixed Income & <span className="section-heading-focus">Alternatives</span>
          </h1>
          <p className="fia-hub__lead">
            Beyond mutual funds — explore fixed deposits, bonds, unlisted equity, and P2P lending
            with a consultation-first approach.
          </p>
          <p className="fia-hub__description">
            Each product has different risk, liquidity, and regulatory considerations. We help you
            understand fit before you invest — not investment advice; partner and issuer terms apply.
          </p>
          <div className="offerings-cta fia-hub__cta">
            <Link to="/book-consultation" className="offerings-btn offerings-btn--primary">
              Book consultation
            </Link>
            <Link to="/contact" className="offerings-btn offerings-btn--secondary">
              Contact us
            </Link>
          </div>
        </div>
        <div className="fia-hub__hero-img" data-aos="fade-left">
          <img src={financeIllustration} alt="" className="hero-illustration" />
        </div>
      </div>

      <section className="fia-hub__section">
        <h2 className="invest-product-section-title">{PRODUCT_CATEGORIES.fixed_income}</h2>
        <p className="invest-product-section-lead">
          Stable income options for conservative and balanced portfolios.
        </p>
        <div className="invest-flow-grid">
          {fixedIncome.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="fia-hub__section">
        <h2 className="invest-product-section-title">{PRODUCT_CATEGORIES.alternatives}</h2>
        <p className="invest-product-section-lead">
          Higher-risk sleeves for experienced investors seeking diversification.
        </p>
        <div className="invest-flow-grid">
          {alternatives.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <p className="fia-hub__disclaimer">
        Products marked “Coming soon” are listed for discovery; availability depends on partner
        onboarding and regulatory approvals. Past performance is not indicative of future results.
      </p>
    </div>
  );
}
