import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasketUser } from '../context/BasketUserContext';
import InvestSubNav from '../components/InvestSubNav';
import { BASKET_PRODUCT_NAME } from '../data/baskets';
import ElementalIcon, { elementFromBasketId } from '../components/ElementalIcon';
import '../styles/basket-screener.css';
import '../styles/basket-analytics.css';

const STEPS = [
  { key: 'age', q: 'What age band are you in?', type: 'select', options: ['18–30', '31–40', '41–50', '51+'] },
  { key: 'horizon', q: 'Investment horizon for this corpus?', type: 'select', options: ['<3 years', '3–5 years', '5–10 years', '10+ years'] },
  { key: 'income', q: 'How stable is your primary income?', type: 'select', options: ['Very stable', 'Mostly stable', 'Variable', 'Starting / building'] },
  { key: 'risk', q: 'When markets drop 20%, you…', type: 'select', options: ['Buy more', 'Hold calmly', 'Unsure', 'Prefer to exit'] },
  { key: 'emergency', q: 'Emergency fund status?', type: 'select', options: ['>9 months expenses', '6–9 months', '3–6 months', '<3 months'] },
  { key: 'goal', q: 'Primary goal right now?', type: 'select', options: ['Wealth growth', 'Child future', 'Home', 'Retirement', 'Safety first'] },
];

function scoreAnswers(a) {
  let s = 40;
  const age = a.age;
  if (age === '18–30') s += 5;
  if (age === '51+') s -= 5;
  if (a.horizon === '10+ years') s += 20;
  if (a.horizon === '5–10 years') s += 12;
  if (a.horizon === '3–5 years') s += 4;
  if (a.horizon === '<3 years') s -= 15;
  if (a.risk === 'Buy more') s += 18;
  if (a.risk === 'Hold calmly') s += 10;
  if (a.risk === 'Unsure') s += 0;
  if (a.risk === 'Prefer to exit') s -= 18;
  if (a.emergency === '>9 months expenses') s += 12;
  if (a.emergency === '<3 months') s -= 12;
  if (a.income === 'Very stable') s += 8;
  if (a.income === 'Variable') s -= 4;
  if (a.goal === 'Safety first') s -= 15;
  if (a.goal === 'Wealth growth') s += 8;
  return Math.max(12, Math.min(96, Math.round(s)));
}

function basketFromScore(score) {
  if (score >= 68) return { id: 'fire', title: 'FIRE', subtitle: 'Aggressive growth sleeve' };
  if (score >= 44) return { id: 'water', title: 'WATER', subtitle: 'Balanced glide path' };
  return { id: 'earth', title: 'EARTH', subtitle: 'Stability & resilience' };
}

export default function RiskProfilePage() {
  const { setRiskProfile, catalog } = useBasketUser();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const cur = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const result = useMemo(() => {
    if (step < STEPS.length) return null;
    const score = scoreAnswers(answers);
    const rec = basketFromScore(score);
    const basket = catalog.find((b) => b.id === rec.id);
    return { score, rec, basket };
  }, [step, answers, catalog]);

  const pick = (val) => {
    setAnswers((prev) => ({ ...prev, [cur.key]: val }));
    if (step + 1 < STEPS.length) setStep(step + 1);
    else {
      const score = scoreAnswers({ ...answers, [cur.key]: val });
      const rec = basketFromScore(score);
      setRiskProfile({
        answers: { ...answers, [cur.key]: val },
        score,
        recommendedId: rec.id,
        at: new Date().toISOString(),
      });
      setStep(STEPS.length);
    }
  };

  return (
    <div className="an-invest-sharp an-risk-profile-page">
      <InvestSubNav />
      <Link to="/invest/baskets" className="an-fund-breadcrumb" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
        ← {BASKET_PRODUCT_NAME}
      </Link>

      <section className="an-risk-profile">
        <h1 className="an-sb-page-title">Risk profile quiz</h1>
        <p className="an-sb-muted">Six quick questions — no jargon. We map your score to FIRE, WATER, or EARTH.</p>
        <div className="an-risk-profile__progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="an-risk-profile__progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <AnimatePresence mode="wait">
          {step < STEPS.length && (
            <motion.div
              key={cur.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="an-glass-card an-risk-profile__card"
            >
              <p className="an-risk-profile__question">{cur.q}</p>
              <div className="an-risk-profile__options">
                {cur.options.map((opt) => (
                  <button key={opt} type="button" className="an-btn-ghost an-risk-profile__option" onClick={() => pick(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="an-glass-card an-risk-profile__card an-risk-profile__result"
            >
              <p className="an-risk-profile__score-label">Your risk score</p>
              <div className="an-risk-profile__score">{result.score}</div>
              <div className="an-risk-profile__rec-head">
                <ElementalIcon element={elementFromBasketId(result.rec.id)} size={36} />
                <div>
                  <strong>{result.rec.title}</strong>
                  <span>{result.rec.subtitle}</span>
                </div>
              </div>
              <p className="an-sb-muted">
                Suggested SIP anchor: ₹{result.basket?.sipSuggestionMonthly?.toLocaleString('en-IN') || '—'}/mo (illustrative).
              </p>
              <div className="an-risk-profile__actions">
                <Link className="an-btn-primary" to={`/invest/basket/${result.rec.id}`}>
                  View {result.rec.title} analytics
                </Link>
                <Link className="an-btn-ghost" to="/invest/baskets">
                  View all {BASKET_PRODUCT_NAME.toLowerCase()}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
