import React, { useState, useCallback, useRef } from 'react';
import {
  FaUser,
  FaBriefcase,
  FaUsers,
  FaFileAlt,
  FaCheck,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';
import { FiFile } from 'react-icons/fi';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.webp';
import { submitOnboarding } from '../../services/onboardingService';
import { isBackendAvailable, getApiBaseUrl } from '../../api/config';
import './ClientOnboarding.css';

const ARN = process.env.REACT_APP_AMFI_ARN || 'ARN-347085';

const STEPS = [
  { id: 1, key: 'personal', label: 'Personal' },
  { id: 2, key: 'financial', label: 'Financial' },
  { id: 3, key: 'nominee', label: 'Nominee' },
  { id: 4, key: 'documents', label: 'Documents' },
  { id: 5, key: 'review', label: 'Review' }
];

const TAX_STATUSES = [
  'INDIVIDUAL',
  'MINOR',
  'NRI - NRE',
  'NRI - NRO',
  'HUF',
  'FIRM / COMPANY'
];

const OCCUPATIONS = [
  'Salaried',
  'Self-employed / Business',
  'Professional',
  'Retired',
  'Student',
  'Homemaker',
  'Other'
];

const INCOME_RANGES = [
  'Below ₹3 Lakh',
  '₹3–5 Lakh',
  '₹5–10 Lakh',
  '₹10–25 Lakh',
  '₹25 Lakh – ₹1 Crore',
  'Above ₹1 Crore'
];

const INVESTMENT_GOALS = [
  'Wealth creation',
  'Retirement',
  'Tax saving (80C / ELSS)',
  "Child's education / marriage",
  'Emergency fund',
  'Other'
];

const RISK_LEVELS = ['Conservative', 'Moderate', 'Balanced', 'Aggressive'];

const HORIZONS = [
  'Less than 1 year',
  '1–3 years',
  '3–5 years',
  '5–10 years',
  'More than 10 years'
];

const RELATIONSHIPS = [
  'Spouse',
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Other'
];

const emptyNominee = () => ({
  name: '',
  relationship: '',
  allocation: '',
  isMinor: 'No'
});

const initialForm = {
  personal: {
    fullName: '',
    mobile: '',
    email: '',
    pan: '',
    dob: '',
    occupation: '',
    taxStatus: 'INDIVIDUAL'
  },
  financial: {
    annualIncome: '',
    investmentGoal: '',
    investmentType: 'SIP',
    riskAppetite: '',
    horizon: '',
    bankAccount: '',
    ifsc: ''
  },
  nominees: [
    {
      ...emptyNominee(),
      allocation: '100'
    }
  ],
  documents: {
    panCard: null,
    aadhaarFront: null,
    aadhaarBack: null,
    bankProof: null,
    signature: null,
    nomineeProof: null
  }
};

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePan(v) {
  return String(v || '')
    .toUpperCase()
    .replace(/\s/g, '');
}

function normalizeIfsc(v) {
  return String(v || '').toUpperCase().replace(/\s/g, '');
}

function normalizeMobile(v) {
  return String(v || '').replace(/\D/g, '').slice(0, 10);
}

function formatInDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default function ClientOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const fileInputs = useRef({});

  const updatePersonal = useCallback((patch) => {
    setForm((f) => ({ ...f, personal: { ...f.personal, ...patch } }));
  }, []);

  const updateFinancial = useCallback((patch) => {
    setForm((f) => ({ ...f, financial: { ...f.financial, ...patch } }));
  }, []);

  const updateNominee = useCallback((index, patch) => {
    setForm((f) => {
      const nominees = f.nominees.map((n, i) =>
        i === index ? { ...n, ...patch } : n
      );
      return { ...f, nominees };
    });
  }, []);

  const addNominee = useCallback(() => {
    setForm((f) => {
      if (f.nominees.length >= 3) return f;
      const next = [...f.nominees, emptyNominee()];
      return { ...f, nominees: next };
    });
  }, []);

  const validateStep = useCallback(
    (step) => {
      const e = {};
      if (step === 1) {
        const p = form.personal;
        if (!p.fullName.trim()) e.fullName = 'Full name is required';
        const mob = normalizeMobile(p.mobile);
        if (!/^[6-9]\d{9}$/.test(mob)) e.mobile = 'Enter a valid 10-digit Indian mobile number';
        if (!EMAIL_RE.test((p.email || '').trim())) e.email = 'Enter a valid email';
        const pan = normalizePan(p.pan);
        if (!PAN_RE.test(pan)) e.pan = 'PAN must be like AAAAA9999A';
        if (!p.dob) e.dob = 'Date of birth is required';
        if (!p.occupation) e.occupation = 'Select occupation';
        if (!p.taxStatus) e.taxStatus = 'Select tax status';
      }
      if (step === 2) {
        const x = form.financial;
        if (!x.annualIncome) e.annualIncome = 'Select annual income range';
        if (!x.investmentType) e.investmentType = 'Select investment type';
        if (!x.bankAccount.trim()) e.bankAccount = 'Bank account number is required';
        if (x.bankAccount.replace(/\s/g, '').length < 5) e.bankAccount = 'Enter a valid account number';
        const ifsc = normalizeIfsc(x.ifsc);
        if (!IFSC_RE.test(ifsc)) e.ifsc = 'IFSC must be like ABCD0123456';
      }
      if (step === 3) {
        form.nominees.forEach((n, i) => {
          if (!n.name.trim()) e[`nominee_name_${i}`] = 'Nominee name is required';
          if (!n.relationship) e[`nominee_rel_${i}`] = 'Select relationship';
          const a = parseFloat(String(n.allocation).replace(/,/g, ''));
          if (Number.isNaN(a) || a <= 0 || a > 100) {
            e[`nominee_alloc_${i}`] = 'Enter allocation between 1 and 100';
          }
        });
        const total = form.nominees.reduce(
          (sum, n) => sum + (parseFloat(String(n.allocation).replace(/,/g, '')) || 0),
          0
        );
        if (Math.abs(total - 100) > 0.01) e.nomineeTotal = 'Total allocation across nominees must equal 100%';
      }
      if (step === 4) {
        const d = form.documents;
        if (!d.panCard) e.panCard = 'Upload PAN card';
        if (!d.aadhaarFront) e.aadhaarFront = 'Upload Aadhaar front';
        if (!d.aadhaarBack) e.aadhaarBack = 'Upload Aadhaar back';
        if (!d.bankProof) e.bankProof = 'Upload bank proof';
        if (!d.signature) e.signature = 'Upload signature';
      }
      return e;
    },
    [form]
  );

  const goNext = () => {
    const ve = validateStep(currentStep);
    setErrors(ve);
    if (Object.keys(ve).length > 0) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    if (currentStep < 5) setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const ve = validateStep(4);
    if (Object.keys(ve).length > 0) {
      setErrors(ve);
      setCurrentStep(4);
      toast.error('Please complete required documents.');
      return;
    }

    if (!isBackendAvailable()) {
      toast.error(
        `Configure REACT_APP_API_BASE_URL and run the API server. Current: "${getApiBaseUrl() || '(empty)'}"`
      );
      return;
    }

    setSubmitting(true);
    try {
      const meta = {
        personal: {
          ...form.personal,
          mobile: normalizeMobile(form.personal.mobile),
          pan: normalizePan(form.personal.pan),
          email: form.personal.email.trim()
        },
        financial: {
          ...form.financial,
          ifsc: normalizeIfsc(form.financial.ifsc)
        },
        nominees: form.nominees.map((n) => ({
          ...n,
          allocation: parseFloat(String(n.allocation).replace(/,/g, ''))
        }))
      };

      const files = {
        panCard: form.documents.panCard,
        aadhaarFront: form.documents.aadhaarFront,
        aadhaarBack: form.documents.aadhaarBack,
        bankProof: form.documents.bankProof,
        signature: form.documents.signature,
        nomineeProof: form.documents.nomineeProof
      };

      const res = await submitOnboarding(meta, files);
      setSubmissionResult(res);
      toast.success('Application submitted successfully.');
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const setDocumentFile = (key, file) => {
    setForm((f) => ({
      ...f,
      documents: { ...f.documents, [key]: file || null }
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const stepIcon = (key) => {
    switch (key) {
      case 'personal':
        return <FaUser />;
      case 'financial':
        return <FaBriefcase />;
      case 'nominee':
        return <FaUsers />;
      case 'documents':
        return <FaFileAlt />;
      default:
        return <FaFileAlt />;
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="co-page">
        <div className="co-top">
          <div className="co-brand">
            <img src={logo} alt="Anupaat Nivesh" className="co-logo" />
            <div className="co-brand-titles">
              <h1>Client Onboarding — Anupaat Nivesh Pvt. Ltd.</h1>
              <p>AMFI Registered Mutual Fund Distributor</p>
            </div>
          </div>
          <div className="co-trust">
            <div className="co-arn">{ARN}</div>
            <div className="co-secure">
              <span className="co-secure-dot" aria-hidden />
              Secure Form
            </div>
          </div>
        </div>
        <div className="co-card">
          <div className="co-success">
            <div className="co-step-circle" style={{ background: 'var(--color-primary)', color: '#fff' }}>
              <FaCheck />
            </div>
            <h2>Thank you — we received your documents</h2>
            <p>
              Our team will verify your details and contact you for the next steps toward account
              opening.
            </p>
            <p>
              <strong>Reference ID:</strong>
            </p>
            <span className="co-ref">{submissionResult.submissionId}</span>
            {submissionResult.ephemeralStorage ? (
              <p style={{ marginTop: '1.6rem', fontSize: '1.3rem', color: '#856404' }}>
                Note: This deployment uses temporary server storage. For production, configure durable
                storage for uploads.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="co-page">
      <div className="co-top">
        <div className="co-brand">
          <img src={logo} alt="Anupaat Nivesh" className="co-logo" />
          <div className="co-brand-titles">
            <h1>Client Onboarding — Anupaat Nivesh Pvt. Ltd.</h1>
            <p>AMFI Registered Mutual Fund Distributor</p>
          </div>
        </div>
        <div className="co-trust">
          <div className="co-arn">{ARN}</div>
          <div className="co-secure">
            <span className="co-secure-dot" aria-hidden />
            Secure Form
          </div>
        </div>
      </div>

      <div className="co-stepper" role="navigation" aria-label="Onboarding steps">
        {STEPS.map((s) => {
          const done = currentStep > s.id;
          const cur = currentStep === s.id;
          return (
            <div
              key={s.key}
              className={`co-step ${done ? 'is-done' : ''} ${cur ? 'is-current' : ''}`}
            >
              <div className="co-step-circle">{done ? <FaCheck /> : s.id}</div>
              <div className="co-step-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="co-card">
        {!isBackendAvailable() && currentStep === 5 ? (
          <div className="co-api-warning">
            API base URL is not configured. Set <code>REACT_APP_API_BASE_URL</code> in{' '}
            <code>.env</code> and run <code>npm run server</code> to receive submissions locally.
            Current value: <strong>{getApiBaseUrl() || '(empty)'}</strong>
          </div>
        ) : null}

        {currentStep === 1 && (
          <>
            <div className="co-card-head">
              <span className="co-card-icon">{stepIcon('personal')}</span>
              <div>
                <h2>Personal Information</h2>
                <p>Basic details as per your official documents</p>
              </div>
            </div>
            <div className="co-grid">
              <div className="co-field co-grid-full">
                <label>
                  Full Name (As per PAN) <span className="co-req">*</span>
                </label>
                <input
                  value={form.personal.fullName}
                  onChange={(e) => updatePersonal({ fullName: e.target.value })}
                  placeholder="e.g. Rajesh Kumar Sharma"
                  className={errors.fullName ? 'co-input-error' : ''}
                />
                {errors.fullName ? <div className="co-err">{errors.fullName}</div> : null}
              </div>
              <div className="co-field">
                <label>
                  Mobile Number <span className="co-req">*</span>
                </label>
                <input
                  inputMode="numeric"
                  value={form.personal.mobile}
                  onChange={(e) => updatePersonal({ mobile: normalizeMobile(e.target.value) })}
                  placeholder="9876543210"
                  className={errors.mobile ? 'co-input-error' : ''}
                />
                <div className="co-help">10-digit Indian mobile number</div>
                {errors.mobile ? <div className="co-err">{errors.mobile}</div> : null}
              </div>
              <div className="co-field">
                <label>
                  Email Address <span className="co-req">*</span>
                </label>
                <input
                  type="email"
                  value={form.personal.email}
                  onChange={(e) => updatePersonal({ email: e.target.value })}
                  placeholder="name@example.com"
                  className={errors.email ? 'co-input-error' : ''}
                />
                {errors.email ? <div className="co-err">{errors.email}</div> : null}
              </div>
              <div className="co-field">
                <label>
                  PAN Number <span className="co-req">*</span>
                </label>
                <input
                  value={form.personal.pan}
                  onChange={(e) => updatePersonal({ pan: normalizePan(e.target.value) })}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className={errors.pan ? 'co-input-error' : ''}
                />
                <div className="co-help">Format: AAAAA9999A</div>
                {errors.pan ? <div className="co-err">{errors.pan}</div> : null}
              </div>
              <div className="co-field">
                <label>
                  Date of Birth <span className="co-req">*</span>
                </label>
                <input
                  type="date"
                  value={form.personal.dob}
                  onChange={(e) => updatePersonal({ dob: e.target.value })}
                  className={errors.dob ? 'co-input-error' : ''}
                />
                {errors.dob ? <div className="co-err">{errors.dob}</div> : null}
              </div>
              <div className="co-field co-grid-full">
                <label>
                  Occupation <span className="co-req">*</span>
                </label>
                <select
                  value={form.personal.occupation}
                  onChange={(e) => updatePersonal({ occupation: e.target.value })}
                  className={errors.occupation ? 'co-input-error' : ''}
                >
                  <option value="">Select occupation</option>
                  {OCCUPATIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {errors.occupation ? <div className="co-err">{errors.occupation}</div> : null}
              </div>
              <div className="co-field co-grid-full">
                <label>
                  Tax Status <span className="co-req">*</span>
                </label>
                <div className="co-tile-grid">
                  {TAX_STATUSES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`co-tile ${form.personal.taxStatus === t ? 'is-on' : ''}`}
                      onClick={() => updatePersonal({ taxStatus: t })}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.taxStatus ? <div className="co-err">{errors.taxStatus}</div> : null}
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="co-card-head">
              <span className="co-card-icon">{stepIcon('financial')}</span>
              <div>
                <h2>Financial Details</h2>
                <p>Required for KYC and suitability assessment</p>
              </div>
            </div>
            <div className="co-grid">
              <div className="co-field">
                <label>
                  Annual Income <span className="co-req">*</span>
                </label>
                <select
                  value={form.financial.annualIncome}
                  onChange={(e) => updateFinancial({ annualIncome: e.target.value })}
                  className={errors.annualIncome ? 'co-input-error' : ''}
                >
                  <option value="">Select range</option>
                  {INCOME_RANGES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.annualIncome ? <div className="co-err">{errors.annualIncome}</div> : null}
              </div>
              <div className="co-field">
                <label>Investment Goal</label>
                <select
                  value={form.financial.investmentGoal}
                  onChange={(e) => updateFinancial({ investmentGoal: e.target.value })}
                >
                  <option value="">Select goal</option>
                  {INVESTMENT_GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="co-field co-grid-full">
                <label>
                  Investment Type <span className="co-req">*</span>
                </label>
                <div className="co-pills">
                  {['SIP', 'Lumpsum', 'Both'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`co-pill ${form.financial.investmentType === t ? 'is-on' : ''}`}
                      onClick={() => updateFinancial({ investmentType: t })}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="co-field">
                <label>Risk Appetite</label>
                <select
                  value={form.financial.riskAppetite}
                  onChange={(e) => updateFinancial({ riskAppetite: e.target.value })}
                >
                  <option value="">Select</option>
                  {RISK_LEVELS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="co-field">
                <label>Investment Horizon</label>
                <select
                  value={form.financial.horizon}
                  onChange={(e) => updateFinancial({ horizon: e.target.value })}
                >
                  <option value="">Select duration</option>
                  {HORIZONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div className="co-field">
                <label>
                  Bank Account Number <span className="co-req">*</span>
                </label>
                <input
                  value={form.financial.bankAccount}
                  onChange={(e) => updateFinancial({ bankAccount: e.target.value })}
                  placeholder="Account number"
                  className={errors.bankAccount ? 'co-input-error' : ''}
                />
                <div className="co-help">For mandate registration (SIP auto-debit)</div>
                {errors.bankAccount ? <div className="co-err">{errors.bankAccount}</div> : null}
              </div>
              <div className="co-field">
                <label>
                  IFSC Code <span className="co-req">*</span>
                </label>
                <input
                  value={form.financial.ifsc}
                  onChange={(e) => updateFinancial({ ifsc: normalizeIfsc(e.target.value) })}
                  placeholder="HDFC0001234"
                  maxLength={11}
                  className={errors.ifsc ? 'co-input-error' : ''}
                />
                <div className="co-help">Format: AAAA0XXXXXX</div>
                {errors.ifsc ? <div className="co-err">{errors.ifsc}</div> : null}
              </div>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="co-card-head">
              <span className="co-card-icon">{stepIcon('nominee')}</span>
              <div>
                <h2>Nominee Details</h2>
                <p>You may add up to 3 nominees</p>
              </div>
            </div>
            <div className="co-info-banner">
              <IoInformationCircle aria-hidden />
              <div>
                As per SEBI regulations, nominees are recommended. Total allocation across all nominees
                must equal 100%.
              </div>
            </div>
            {errors.nomineeTotal ? (
              <div className="co-err" style={{ marginBottom: '1rem' }}>
                {errors.nomineeTotal}
              </div>
            ) : null}
            {form.nominees.map((n, i) => (
              <div key={i} className="co-nominee-block">
                <div className="co-nominee-title">Nominee {i + 1}</div>
                <div className="co-grid">
                  <div className="co-field">
                    <label>
                      Nominee Name <span className="co-req">*</span>
                    </label>
                    <input
                      value={n.name}
                      onChange={(e) => updateNominee(i, { name: e.target.value })}
                      placeholder="Full name"
                      className={errors[`nominee_name_${i}`] ? 'co-input-error' : ''}
                    />
                    {errors[`nominee_name_${i}`] ? (
                      <div className="co-err">{errors[`nominee_name_${i}`]}</div>
                    ) : null}
                  </div>
                  <div className="co-field">
                    <label>
                      Relationship <span className="co-req">*</span>
                    </label>
                    <select
                      value={n.relationship}
                      onChange={(e) => updateNominee(i, { relationship: e.target.value })}
                      className={errors[`nominee_rel_${i}`] ? 'co-input-error' : ''}
                    >
                      <option value="">Select</option>
                      {RELATIONSHIPS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {errors[`nominee_rel_${i}`] ? (
                      <div className="co-err">{errors[`nominee_rel_${i}`]}</div>
                    ) : null}
                  </div>
                  <div className="co-field">
                    <label>
                      Allocation % <span className="co-req">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      value={n.allocation}
                      onChange={(e) => updateNominee(i, { allocation: e.target.value })}
                      className={errors[`nominee_alloc_${i}`] ? 'co-input-error' : ''}
                    />
                    {errors[`nominee_alloc_${i}`] ? (
                      <div className="co-err">{errors[`nominee_alloc_${i}`]}</div>
                    ) : null}
                  </div>
                  <div className="co-field">
                    <label>Is Nominee a Minor?</label>
                    <select
                      value={n.isMinor}
                      onChange={(e) => updateNominee(i, { isMinor: e.target.value })}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="co-add-nominee"
              onClick={addNominee}
              disabled={form.nominees.length >= 3}
            >
              + Add Another Nominee
            </button>
          </>
        )}

        {currentStep === 4 && (
          <>
            <div className="co-card-head">
              <span className="co-card-icon">{stepIcon('documents')}</span>
              <div>
                <h2>Documents</h2>
                <p>Upload clear scans for faster verification</p>
              </div>
            </div>

            <div className="co-doc-section-title">Identity</div>
            {[
              {
                key: 'panCard',
                title: 'PAN Card',
                req: true
              },
              {
                key: 'aadhaarFront',
                title: 'Aadhaar Card Front',
                req: true
              },
              {
                key: 'aadhaarBack',
                title: 'Aadhaar Card Back',
                req: true
              }
            ].map(({ key, title, req }) => (
              <div key={key} className={`co-doc-row ${errors[key] ? 'co-doc-error' : ''}`}>
                <div className="co-doc-row-left">
                  <FiFile className="co-doc-icon" aria-hidden />
                  <div>
                    <h4>
                      {title}{' '}
                      {req ? <span className="co-req">*</span> : null}{' '}
                      {!req ? <span className="co-optional">(Optional)</span> : null}
                    </h4>
                    <div className="co-doc-formats">
                      Accepted formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX and other common document
                      files.
                    </div>
                    {form.documents[key] ? (
                      <div className="co-doc-file-name">{form.documents[key].name}</div>
                    ) : null}
                    {errors[key] ? <div className="co-err">{errors[key]}</div> : null}
                  </div>
                </div>
                <div>
                  <input
                    ref={(el) => {
                      fileInputs.current[key] = el;
                    }}
                    type="file"
                    className="co-file-input"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => setDocumentFile(key, e.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    className="co-file-btn"
                    onClick={() => fileInputs.current[key]?.click()}
                  >
                    Choose file
                  </button>
                </div>
              </div>
            ))}

            <div className="co-doc-section-title">Financial &amp; Bank</div>
            <div className={`co-doc-row ${errors.bankProof ? 'co-doc-error' : ''}`}>
              <div className="co-doc-row-left">
                <FiFile className="co-doc-icon" aria-hidden />
                <div>
                  <h4>
                    Bank Proof (Cancelled Cheque / Passbook) <span className="co-req">*</span>
                  </h4>
                  <div className="co-doc-formats">
                    Accepted formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX and other common document
                    files.
                  </div>
                  {form.documents.bankProof ? (
                    <div className="co-doc-file-name">{form.documents.bankProof.name}</div>
                  ) : null}
                  {errors.bankProof ? <div className="co-err">{errors.bankProof}</div> : null}
                </div>
              </div>
              <div>
                <input
                  ref={(el) => {
                    fileInputs.current.bankProof = el;
                  }}
                  type="file"
                  className="co-file-input"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => setDocumentFile('bankProof', e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  className="co-file-btn"
                  onClick={() => fileInputs.current.bankProof?.click()}
                >
                  Choose file
                </button>
              </div>
            </div>

            <div className="co-doc-section-title">Signature &amp; Photo</div>
            <div className={`co-doc-row ${errors.signature ? 'co-doc-error' : ''}`}>
              <div className="co-doc-row-left">
                <FiFile className="co-doc-icon" aria-hidden />
                <div>
                  <h4>
                    Signature (on white paper) <span className="co-req">*</span>
                  </h4>
                  <div className="co-doc-formats">
                    Accepted formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX and other common document
                    files.
                  </div>
                  {form.documents.signature ? (
                    <div className="co-doc-file-name">{form.documents.signature.name}</div>
                  ) : null}
                  {errors.signature ? <div className="co-err">{errors.signature}</div> : null}
                </div>
              </div>
              <div>
                <input
                  ref={(el) => {
                    fileInputs.current.signature = el;
                  }}
                  type="file"
                  className="co-file-input"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => setDocumentFile('signature', e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  className="co-file-btn"
                  onClick={() => fileInputs.current.signature?.click()}
                >
                  Choose file
                </button>
              </div>
            </div>

            <div className="co-doc-section-title">Nominee Proof</div>
            <div className="co-doc-row">
              <div className="co-doc-row-left">
                <FiFile className="co-doc-icon" aria-hidden />
                <div>
                  <h4>
                    Nominee Identity Proof <span className="co-optional">(Optional)</span>
                  </h4>
                  <div className="co-doc-formats">
                    Accepted formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX and other common document
                    files.
                  </div>
                  {form.documents.nomineeProof ? (
                    <div className="co-doc-file-name">{form.documents.nomineeProof.name}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <input
                  ref={(el) => {
                    fileInputs.current.nomineeProof = el;
                  }}
                  type="file"
                  className="co-file-input"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => setDocumentFile('nomineeProof', e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  className="co-file-btn"
                  onClick={() => fileInputs.current.nomineeProof?.click()}
                >
                  Choose file
                </button>
              </div>
            </div>
          </>
        )}

        {currentStep === 5 && (
          <>
            <div className="co-card-head">
              <span className="co-card-icon">
                <FaCheck />
              </span>
              <div>
                <h2>Review &amp; Submit</h2>
                <p>Confirm your details before sending documents securely</p>
              </div>
            </div>

            <div className="co-review-block">
              <h3>Personal</h3>
              <div className="co-review-row">
                <span>Name</span>
                <span>{form.personal.fullName || '—'}</span>
              </div>
              <div className="co-review-row">
                <span>Mobile</span>
                <span>{normalizeMobile(form.personal.mobile) || '—'}</span>
              </div>
              <div className="co-review-row">
                <span>Email</span>
                <span>{form.personal.email || '—'}</span>
              </div>
              <div className="co-review-row">
                <span>PAN</span>
                <span>{normalizePan(form.personal.pan) || '—'}</span>
              </div>
              <div className="co-review-row">
                <span>Date of birth</span>
                <span>{formatInDate(form.personal.dob)}</span>
              </div>
              <div className="co-review-row">
                <span>Occupation</span>
                <span>{form.personal.occupation || '—'}</span>
              </div>
              <div className="co-review-row">
                <span>Tax status</span>
                <span>{form.personal.taxStatus || '—'}</span>
              </div>
            </div>

            <div className="co-review-block">
              <h3>Financial</h3>
              <div className="co-review-row">
                <span>Annual income</span>
                <span>{form.financial.annualIncome || '—'}</span>
              </div>
              <div className="co-review-row">
                <span>Investment type</span>
                <span>{form.financial.investmentType || '—'}</span>
              </div>
              <div className="co-review-row">
                <span>Bank account</span>
                <span>{form.financial.bankAccount ? '••••••••' + form.financial.bankAccount.slice(-4) : '—'}</span>
              </div>
              <div className="co-review-row">
                <span>IFSC</span>
                <span>{normalizeIfsc(form.financial.ifsc) || '—'}</span>
              </div>
            </div>

            <div className="co-review-block">
              <h3>Nominees</h3>
              {form.nominees.map((n, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <div className="co-review-row">
                    <span>Nominee {i + 1}</span>
                    <span>{n.name || '—'}</span>
                  </div>
                  <div className="co-review-row">
                    <span>Relationship / %</span>
                    <span>
                      {n.relationship || '—'} / {n.allocation || '—'}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="co-review-block">
              <h3>Documents attached</h3>
              {[
                ['panCard', 'PAN Card'],
                ['aadhaarFront', 'Aadhaar Front'],
                ['aadhaarBack', 'Aadhaar Back'],
                ['bankProof', 'Bank proof'],
                ['signature', 'Signature'],
                ['nomineeProof', 'Nominee proof (optional)']
              ].map(([key, label]) => (
                <div key={key} className="co-review-row">
                  <span>{label}</span>
                  <span>{form.documents[key] ? form.documents[key].name : '—'}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="co-actions">
          {currentStep > 1 ? (
            <button type="button" className="co-btn co-btn-back" onClick={goBack}>
              <FaArrowLeft aria-hidden />
              Back
            </button>
          ) : (
            <span />
          )}
          {currentStep < 5 ? (
            <button type="button" className="co-btn co-btn-next" onClick={goNext}>
              Continue
              <FaArrowRight aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              className="co-btn co-btn-next"
              onClick={handleSubmit}
              disabled={submitting || !isBackendAvailable()}
            >
              {submitting ? 'Submitting…' : 'Submit application'}
              {!submitting ? <FaArrowRight aria-hidden /> : null}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
