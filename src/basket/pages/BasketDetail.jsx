import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useBasketUser } from '../context/BasketUserContext';
import { BASKET_PRODUCT_NAME, getBasketById } from '../data/baskets';
import { enrichBasketFunds } from '../utils/enrichBasket';
import { mergeBasketAnalytics } from '../utils/mergeBasketAnalytics';
import useBasketAnalytics from '../hooks/useBasketAnalytics';
import { openBasketCheckout } from '../services/basketPayment';
import { validatePaymentConfig } from '../../utils/paymentConfig';
import { isBackendAvailable } from '../../api/config';
import InvestSubNav from '../components/InvestSubNav';
import BasketInvestSidebar from '../components/basket-detail/BasketInvestSidebar';
import DistributionCard from '../components/basket-detail/DistributionCard';
import EquityAnalysisCard from '../components/basket-detail/EquityAnalysisCard';
import ParametersCard from '../components/basket-detail/ParametersCard';
import ElementalIcon, { elementFromBasketId } from '../components/ElementalIcon';
import BasketKpiStrip from '../components/basket-analytics/BasketKpiStrip';
import BasketGrowthChart from '../components/basket-analytics/BasketGrowthChart';
import BasketAnScore from '../components/basket-analytics/BasketAnScore';
import BasketLockedHoldings from '../components/basket-analytics/BasketLockedHoldings';
import BasketAllocationDonut from '../components/basket-analytics/BasketAllocationDonut';
import BasketGrowthCalculator from '../components/basket-analytics/BasketGrowthCalculator';
import '../styles/basket-screener.css';
import '../styles/basket-cards.css';
import '../styles/basket-detail.css';
import '../styles/basket-analytics.css';

function scrollToUnlockForm() {
  document.getElementById('basket-unlock')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function BasketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { catalog, hasAccess, unlockBasket, user, setUser } = useBasketUser();
  const raw = useMemo(() => getBasketById(catalog, id), [catalog, id]);
  const { analytics, loading: analyticsLoading, error: analyticsError } = useBasketAnalytics(id);
  const basket = useMemo(() => {
    if (!raw) return null;
    const enriched = enrichBasketFunds(raw);
    return mergeBasketAnalytics(enriched, analytics);
  }, [raw, analytics]);

  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState(null);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const paid = basket && hasAccess(basket.id);

  const onFormChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const startPay = async () => {
    setErr(null);
    if (!form.email || !form.phone) {
      setErr('Email and mobile are required for payment receipt and fund details.');
      return;
    }
    if (!validatePaymentConfig()) {
      setErr('Payment keys not configured. Set REACT_APP_RAZORPAY_KEY_ID.');
      return;
    }
    if (!isBackendAvailable() && process.env.NODE_ENV === 'production') {
      setErr('API not configured. Set REACT_APP_API_BASE_URL or use same-origin Vercel deploy.');
      return;
    }
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      source: 'elemental_basket',
    };
    setUser(userData);
    setPaying(true);
    try {
      await openBasketCheckout({
        basket,
        userData,
        onSuccess: (res) => {
          unlockBasket(basket.id);
          setPaying(false);
          navigate('/invest/payment-success', {
            state: { basketId: basket.id, paymentId: res.razorpay_payment_id },
          });
        },
        onFailure: (e) => {
          setPaying(false);
          if (e?.message !== 'Payment cancelled') setErr(e?.message || 'Payment failed');
        },
      });
    } catch (e) {
      setPaying(false);
      setErr(e?.message || 'Could not start checkout');
    }
  };

  if (!basket) {
    return (
      <div className="an-invest-sharp" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <InvestSubNav />
        <p>Basket not found.</p>
        <Link to="/invest/baskets" className="an-btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to baskets
        </Link>
      </div>
    );
  }

  return (
    <div className="an-invest-sharp an-basket-detail-page">
      <InvestSubNav />
      <Link to="/invest/baskets" className="an-fund-breadcrumb" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
        ← {BASKET_PRODUCT_NAME}
      </Link>

      <header className="an-basket-page-header">
        <div className="an-basket-page-header__main">
          <div className="an-basket-page-header__icon">
            <ElementalIcon element={basket.element || elementFromBasketId(basket.id)} size={40} />
          </div>
          <div>
            <h1 className="an-sb-page-title" style={{ marginBottom: 0 }}>
              {basket.name}
            </h1>
            <p className="an-sb-muted">{basket.fullName || basket.tagline}</p>
            <p className="an-basket-page-header__summary">{basket.summary}</p>
          </div>
        </div>
        {!paid && (
          <button
            type="button"
            className="an-basket-page-header__price an-basket-page-header__price--cta"
            onClick={scrollToUnlockForm}
            aria-label={`Unlock basket from ₹${basket.price.toLocaleString('en-IN')}`}
          >
            <span>Unlock from</span>
            <strong>₹{basket.price.toLocaleString('en-IN')}</strong>
            <span className="an-basket-page-header__price-hint">Go to checkout ↓</span>
          </button>
        )}
      </header>

      <div className="an-basket-detail-profile-strip" role="list" aria-label="Basket profile">
        <div className="an-basket-detail-profile-stat" role="listitem">
          <span>Risk level</span>
          <strong>{basket.riskLevel}</strong>
        </div>
        <div className="an-basket-detail-profile-stat" role="listitem">
          <span>Horizon</span>
          <strong>{basket.horizonYears}</strong>
        </div>
        <div className="an-basket-detail-profile-stat" role="listitem">
          <span>Expected return*</span>
          <strong>{basket.expectedReturn ?? '—'}%</strong>
        </div>
        <div className="an-basket-detail-profile-stat" role="listitem">
          <span>Min investment</span>
          <strong>₹{basket.minInvestment.toLocaleString('en-IN')}</strong>
        </div>
        <div className="an-basket-detail-profile-stat" role="listitem">
          <span>Volatility</span>
          <strong>{analyticsLoading ? '…' : `${basket.volatilityPct ?? '—'}%`}</strong>
        </div>
      </div>

      {analyticsError && (
        <p className="an-basket-analytics-error" role="alert">
          Live analytics unavailable ({analyticsError}). Showing configured targets and cached data where available.
        </p>
      )}

      <div className="an-basket-detail-grid">
        <div className="an-basket-detail-main">
          <BasketKpiStrip returns={analytics?.returns} loading={analyticsLoading} />
          <BasketGrowthChart analytics={analytics} loading={analyticsLoading} />

          <div className="an-basket-allocation-row">
            <BasketAllocationDonut
              slices={basket.portfolioConstruction || basket.distributionSlices}
              title="Portfolio construction"
            />
            <DistributionCard assetSlices={basket.assetSlices} />
          </div>

          {basket.sectors?.length > 0 && (
            <EquityAnalysisCard marketCap={basket.marketCap} sectors={basket.sectors} />
          )}

          <div className="an-basket-risk-row">
            <BasketAnScore anScore={basket.anScore} risk={analytics?.risk} />
            <ParametersCard
              sharpe={basket.metrics?.sharpe}
              expenseRatio={basket.expenseRatio}
              maxDrawdown={basket.metrics?.maxDrawdown}
              volatility={basket.metrics?.volatility}
            />
          </div>

          <BasketLockedHoldings basket={basket} paid={paid} onUnlock={scrollToUnlockForm} />

          <BasketGrowthCalculator expectedReturn={basket.expectedReturn} basketName={basket.name} />

          {basket.idealForLabels?.length > 0 && (
            <div className="an-sb-card an-basket-ideal-card">
              <h3 className="an-card-heading">Ideal for</h3>
              <ul className="an-why-basket-bullets">
                {basket.idealForLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="an-sb-card an-basket-why-card">
            <h3 className="an-card-heading">Why {basket.name}</h3>
            <div className="an-card-body">
              <p>{basket.philosophy}</p>
              {basket.whyBasket?.bullets && (
                <ul className="an-why-basket-bullets">
                  {basket.whyBasket.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              <p className="an-text-risk an-basket-avoid-line">
                <strong>Avoid if:</strong> {basket.whyBasket.avoid}
              </p>
            </div>
          </div>

          {paid && basket.research?.length > 0 && (
            <div className="an-sb-card an-basket-research-card">
              <h3 className="an-card-heading">Research notes</h3>
              {basket.research.map((r) => (
                <div key={r.title} className="an-research-note">
                  <div className="an-research-note__date">{r.date}</div>
                  <strong>{r.title}</strong>
                  <p>{r.excerpt}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <BasketInvestSidebar
          basket={basket}
          paid={paid}
          form={form}
          onFormChange={onFormChange}
          onPay={startPay}
          paying={paying}
          error={err}
        />
      </div>

      <p className="an-compliance an-basket-detail-footnote">
        *Expected return is illustrative target, not guaranteed. Mutual fund investments are subject to market risks.
        Past performance does not guarantee future returns. Basket NAV is a synthetic model portfolio computed from
        underlying scheme NAV history; actual investor returns may differ.
      </p>
    </div>
  );
}
