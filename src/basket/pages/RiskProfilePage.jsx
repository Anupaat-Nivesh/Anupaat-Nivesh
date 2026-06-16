import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasketUser } from '../context/BasketUserContext';
import InvestSubNav from '../components/InvestSubNav';
import { BASKET_PRODUCT_NAME } from '../data/baskets';
import ElementalIcon, { elementFromBasketId } from '../components/ElementalIcon';
import { basketById } from '../data/config/index.js';
import '../styles/basket-screener.css';
import '../styles/basket-analytics.css';

const STEPS = [
  { key: 'age', q: 'What age band are you in?', options: ['18–30', '31–40', '41–50', '51+'] },
  { key: 'horizon', q: 'Investment horizon for this corpus?', options: ['<3 years', '3–5 years', '5–10 years', '10+ years'] },
  { key: 'income', q: 'How stable is your primary income?', options: ['Very stable', 'Mostly stable', 'Variable', 'Starting / building'] },
  { key: 'risk', q: 'When markets drop 20%, you…', options: ['Buy more', 'Hold calmly', 'Unsure', 'Prefer to exit'] },
  { key: 'emergency', q: 'Emergency fund status?', options: ['>9 months expenses', '6–9 months', '3–6 months', '<3 months'] },
  { key: 'goal', q: 'Primary goal right now?', options: ['Wealth growth', 'Child future', 'Home', 'Retirement', 'Safety first'] },
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
  if (score >= 68) return { id: 'fire', ...pickRec('fire') };
  if (score >= 44) return { id: 'water', ...pickRec('water') };
  return { id: 'earth', ...pickRec('earth') };
}

function pickRec(id) {
  const b = basketById[id];
  return {
    title: b?.name || id.toUpperCase(),
    subtitle: b?.comparison?.objective || '',
  };
}

export default function RiskProfilePage() {
  const { setRiskProfile } = useBasketUser();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const cur = STEPS[step];
  const progress = step < STEPS.length ? ((step + 1) / STEPS.length) * 100 : 100;

  const result = useMemo(() => {
    if (step < STEPS.length) return null;
    const score = scoreAnswers(answers);
    const rec = basketFromScore(score);
    return { score, rec };
  }, [step, answers]);

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
        <h1 className="an-sb-page-title">Risk Profiling</h1>

        {step < STEPS.length && (
          <>
            <p className="an-risk-profile__step">
              Question {step + 1} of {STEPS.length}
            </p>
            <div className="an-risk-profile__progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="an-risk-profile__progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}

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
              <p className="an-risk-profile__score-label">Your match</p>
              <div className="an-risk-profile__rec-head">
                <ElementalIcon element={elementFromBasketId(result.rec.id)} size={36} />
                <div>
                  <strong>{result.rec.title} Basket</strong>
                  <span>{result.rec.subtitle}</span>
                </div>
              </div>
              <div className="an-risk-profile__actions">
                <Link className="an-btn-primary" to={`/invest/basket/${result.rec.id}`}>
                  Explore {result.rec.title} Basket
                </Link>
                <Link className="an-btn-ghost" to="/invest/baskets">
                  Compare all baskets
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
