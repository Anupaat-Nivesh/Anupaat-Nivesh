import React, { useMemo, useState } from 'react';
import {
  createOnboardingFolder,
  submitOnboarding,
  uploadOnboardingDocument,
} from '../../services/onboardingService';
import { validatePanForTaxStatus } from '../../utils/panValidation';
import './OnboardingWizard.css';

const steps = ['Personal', 'Financial', 'Nominee', 'Documents', 'Review'];

const requiredDocs = [
  { key: 'panCard', label: 'PAN Card', required: true },
  { key: 'aadhaarFront', label: 'Aadhaar Front', required: true },
  { key: 'aadhaarBack', label: 'Aadhaar Back', required: true },
  { key: 'bankProof', label: 'Bank Proof', required: true },
  { key: 'signature', label: 'Signature (white paper)', required: true },
  { key: 'nomineeProof', label: 'Nominee Proof', required: false },
];

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OnboardingWizard = () => {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [folderInfo, setFolderInfo] = useState(null);

  const [form, setForm] = useState({
    personal: {
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      pan: '',
      dob: '',
      occupation: '',
      taxStatus: '',
    },
    financial: {
      annualIncome: '',
      investmentGoal: '',
      investmentType: 'SIP',
      riskAppetite: '',
      investmentHorizon: '',
      bankAccountNumber: '',
      ifsc: '',
    },
    nominee: {
      name: '',
      relationship: '',
      allocation: '100',
      isMinor: 'No',
    },
    documents: {},
  });

  const setNestedValue = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setFieldErrors((prev) => ({ ...prev, [`${section}.${key}`]: '' }));
  };

  const validateCurrentStep = () => {
    const errors = {};
    if (step === 0) {
      const p = form.personal;
      if (!p.firstName.trim()) errors['personal.firstName'] = 'First name is required';
      if (/\s/.test(p.firstName)) {
        errors['personal.firstName'] = 'Spaces are not allowed in first name; use Last name for surname';
      }
      if (!MOBILE_REGEX.test(p.mobile)) errors['personal.mobile'] = 'Enter valid 10-digit Indian mobile';
      if (!EMAIL_REGEX.test(p.email)) errors['personal.email'] = 'Enter valid email';
      const panResult = validatePanForTaxStatus(p.pan, p.taxStatus);
      if (!panResult.ok) errors['personal.pan'] = panResult.message;
      if (!p.dob) errors['personal.dob'] = 'Date of birth is required';
      if (!p.occupation) errors['personal.occupation'] = 'Occupation is required';
      if (!p.taxStatus) errors['personal.taxStatus'] = 'Tax status is required';
    }
    if (step === 1) {
      const f = form.financial;
      if (!f.annualIncome) errors['financial.annualIncome'] = 'Annual income is required';
      if (!f.investmentGoal) errors['financial.investmentGoal'] = 'Investment goal is required';
      if (!f.riskAppetite) errors['financial.riskAppetite'] = 'Risk appetite is required';
      if (!f.investmentHorizon) errors['financial.investmentHorizon'] = 'Investment horizon is required';
      if (!/^\d{9,18}$/.test(f.bankAccountNumber)) errors['financial.bankAccountNumber'] = 'Enter valid account number';
      if (!IFSC_REGEX.test((f.ifsc || '').toUpperCase())) errors['financial.ifsc'] = 'Enter valid IFSC (e.g. HDFC0001234)';
    }
    if (step === 2) {
      const n = form.nominee;
      if (!n.name.trim()) errors['nominee.name'] = 'Nominee name is required';
      if (!n.relationship) errors['nominee.relationship'] = 'Relationship is required';
      if (Number(n.allocation) !== 100) errors['nominee.allocation'] = 'Allocation must be 100 for single nominee';
    }
    if (step === 3) {
      requiredDocs.forEach((doc) => {
        if (doc.required && !form.documents[doc.key]?.uploaded) {
          errors[`documents.${doc.key}`] = `${doc.label} is required`;
        }
      });
      if (!folderInfo?.folderId) {
        errors['documents.folder'] = 'Document folder was not created';
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setFormError('');
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => {
    setFormError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const ensureFolder = async () => {
    if (folderInfo?.folderId) return folderInfo;
    const created = await createOnboardingFolder({
      pan: form.personal.pan.toUpperCase(),
      firstName: form.personal.firstName,
      lastName: form.personal.lastName,
      taxStatus: form.personal.taxStatus,
    });
    setFolderInfo(created);
    return created;
  };

  const handleDocUpload = async (docKey, file) => {
    try {
      setFormError('');
      setBusy(true);
      const folder = await ensureFolder();
      const uploaded = await uploadOnboardingDocument({
        folderId: folder.folderId,
        docType: docKey,
        file,
      });
      setForm((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docKey]: {
            uploaded: true,
            fileName: file.name,
            fileId: uploaded.fileId,
            mimeType: uploaded.mimeType,
            size: uploaded.size,
          },
        },
      }));
      setFieldErrors((prev) => ({ ...prev, [`documents.${docKey}`]: '' }));
    } catch (error) {
      setFormError(error.message || 'Failed to upload document');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!validateCurrentStep()) return;
    try {
      setBusy(true);
      const response = await submitOnboarding({
        ...form,
        driveFolder: folderInfo,
      });
      setSubmitted(response);
    } catch (error) {
      setFormError(error.message || 'Failed to submit onboarding');
    } finally {
      setBusy(false);
    }
  };

  const reviewData = useMemo(
    () => ({
      ...form,
      personal: {
        ...form.personal,
        pan: form.personal.pan.toUpperCase(),
      },
    }),
    [form]
  );

  if (submitted) {
    return (
      <div className="onboarding-wrap">
        <div className="onboarding-card">
          <h2 className="onboarding-title">Onboarding Submitted</h2>
          <p>Submission ID: <strong>{submitted.submissionId}</strong></p>
          <p>Documents folder: <strong>{folderInfo?.folderName || 'Created'}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-card">
        <div className="onboarding-stepper">
          {steps.map((label, idx) => (
            <div key={label} className={`onboarding-step-pill ${idx === step ? 'active' : ''}`}>
              {idx + 1}. {label}
            </div>
          ))}
        </div>

        <h2 className="onboarding-title">{steps[step]} Details</h2>
        {formError ? <div className="onboarding-error onboarding-full">{formError}</div> : null}

        {step === 0 && (
          <div className="onboarding-grid">
            <div className="onboarding-group">
              <label>First name (as per PAN) *</label>
              <input
                value={form.personal.firstName}
                onChange={(e) =>
                  setNestedValue('personal', 'firstName', e.target.value.replace(/\s/g, ''))
                }
                placeholder="Single word, no spaces (e.g. Gourav)"
                autoComplete="given-name"
              />
              <div className="onboarding-error">{fieldErrors['personal.firstName']}</div>
            </div>
            <div className="onboarding-group">
              <label>Last name (optional)</label>
              <input
                value={form.personal.lastName}
                onChange={(e) => setNestedValue('personal', 'lastName', e.target.value)}
                placeholder="e.g. Chugh or Chugh Kumar"
                autoComplete="family-name"
              />
            </div>
            <div className="onboarding-group">
              <label>Mobile Number</label>
              <input value={form.personal.mobile} onChange={(e) => setNestedValue('personal', 'mobile', e.target.value.replace(/\D/g, ''))} maxLength={10} />
              <div className="onboarding-error">{fieldErrors['personal.mobile']}</div>
            </div>
            <div className="onboarding-group">
              <label>Email</label>
              <input value={form.personal.email} onChange={(e) => setNestedValue('personal', 'email', e.target.value)} />
              <div className="onboarding-error">{fieldErrors['personal.email']}</div>
            </div>
            <div className="onboarding-group">
              <label>PAN</label>
              <input
                value={form.personal.pan}
                onChange={(e) => setNestedValue('personal', 'pan', e.target.value.toUpperCase())}
                maxLength={10}
                spellCheck={false}
              />
              <div className="onboarding-hint">4th letter must match tax status (e.g. P for individual).</div>
              <div className="onboarding-error">{fieldErrors['personal.pan']}</div>
            </div>
            <div className="onboarding-group">
              <label>Date of Birth</label>
              <input type="date" value={form.personal.dob} onChange={(e) => setNestedValue('personal', 'dob', e.target.value)} />
              <div className="onboarding-error">{fieldErrors['personal.dob']}</div>
            </div>
            <div className="onboarding-group">
              <label>Occupation</label>
              <select value={form.personal.occupation} onChange={(e) => setNestedValue('personal', 'occupation', e.target.value)}>
                <option value="">Select occupation</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-employed</option>
                <option value="business">Business</option>
                <option value="retired">Retired</option>
              </select>
              <div className="onboarding-error">{fieldErrors['personal.occupation']}</div>
            </div>
            <div className="onboarding-group onboarding-full">
              <label>Tax Status</label>
              <select value={form.personal.taxStatus} onChange={(e) => setNestedValue('personal', 'taxStatus', e.target.value)}>
                <option value="">Select tax status</option>
                <option value="individual">Individual (PAN 4th letter P)</option>
                <option value="minor">Minor (PAN 4th letter P)</option>
                <option value="nri-nre">NRI - NRE (PAN 4th letter P)</option>
                <option value="nri-nro">NRI - NRO (PAN 4th letter P)</option>
                <option value="huf">HUF (PAN 4th letter H)</option>
                <option value="firm">Partnership firm (PAN 4th letter F)</option>
                <option value="company">Company (PAN 4th letter C)</option>
                <option value="trust">Trust (PAN 4th letter T)</option>
                <option value="aop">Association of persons (PAN 4th letter A)</option>
                <option value="boi">Body of individuals (PAN 4th letter B)</option>
                <option value="local-authority">Local authority (PAN 4th letter L)</option>
                <option value="government">Government (PAN 4th letter G)</option>
              </select>
              <div className="onboarding-error">{fieldErrors['personal.taxStatus']}</div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-grid">
            <div className="onboarding-group">
              <label>Annual Income</label>
              <select value={form.financial.annualIncome} onChange={(e) => setNestedValue('financial', 'annualIncome', e.target.value)}>
                <option value="">Select range</option>
                <option value="<5L">Below 5L</option>
                <option value="5L-10L">5L-10L</option>
                <option value="10L-25L">10L-25L</option>
                <option value="25L+">25L+</option>
              </select>
              <div className="onboarding-error">{fieldErrors['financial.annualIncome']}</div>
            </div>
            <div className="onboarding-group">
              <label>Investment Goal</label>
              <select value={form.financial.investmentGoal} onChange={(e) => setNestedValue('financial', 'investmentGoal', e.target.value)}>
                <option value="">Select goal</option>
                <option value="wealth-creation">Wealth Creation</option>
                <option value="retirement">Retirement</option>
                <option value="child-education">Child Education</option>
                <option value="tax-saving">Tax Saving</option>
              </select>
              <div className="onboarding-error">{fieldErrors['financial.investmentGoal']}</div>
            </div>
            <div className="onboarding-group">
              <label>Investment Type</label>
              <select value={form.financial.investmentType} onChange={(e) => setNestedValue('financial', 'investmentType', e.target.value)}>
                <option value="SIP">SIP</option>
                <option value="Lumpsum">Lumpsum</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div className="onboarding-group">
              <label>Risk Appetite</label>
              <select value={form.financial.riskAppetite} onChange={(e) => setNestedValue('financial', 'riskAppetite', e.target.value)}>
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
              <div className="onboarding-error">{fieldErrors['financial.riskAppetite']}</div>
            </div>
            <div className="onboarding-group">
              <label>Investment Horizon</label>
              <select value={form.financial.investmentHorizon} onChange={(e) => setNestedValue('financial', 'investmentHorizon', e.target.value)}>
                <option value="">Select duration</option>
                <option value="<1Y">Below 1 year</option>
                <option value="1Y-3Y">1-3 years</option>
                <option value="3Y-5Y">3-5 years</option>
                <option value="5Y+">5+ years</option>
              </select>
              <div className="onboarding-error">{fieldErrors['financial.investmentHorizon']}</div>
            </div>
            <div className="onboarding-group">
              <label>Bank Account Number</label>
              <input value={form.financial.bankAccountNumber} onChange={(e) => setNestedValue('financial', 'bankAccountNumber', e.target.value.replace(/\D/g, ''))} />
              <div className="onboarding-error">{fieldErrors['financial.bankAccountNumber']}</div>
            </div>
            <div className="onboarding-group">
              <label>IFSC</label>
              <input value={form.financial.ifsc} onChange={(e) => setNestedValue('financial', 'ifsc', e.target.value.toUpperCase())} maxLength={11} />
              <div className="onboarding-error">{fieldErrors['financial.ifsc']}</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-grid">
            <div className="onboarding-group">
              <label>Nominee Name</label>
              <input value={form.nominee.name} onChange={(e) => setNestedValue('nominee', 'name', e.target.value)} />
              <div className="onboarding-error">{fieldErrors['nominee.name']}</div>
            </div>
            <div className="onboarding-group">
              <label>Relationship</label>
              <select value={form.nominee.relationship} onChange={(e) => setNestedValue('nominee', 'relationship', e.target.value)}>
                <option value="">Select relationship</option>
                <option value="spouse">Spouse</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
              </select>
              <div className="onboarding-error">{fieldErrors['nominee.relationship']}</div>
            </div>
            <div className="onboarding-group">
              <label>Allocation %</label>
              <input type="number" value={form.nominee.allocation} onChange={(e) => setNestedValue('nominee', 'allocation', e.target.value)} min={1} max={100} />
              <div className="onboarding-error">{fieldErrors['nominee.allocation']}</div>
            </div>
            <div className="onboarding-group">
              <label>Is Nominee Minor?</label>
              <select value={form.nominee.isMinor} onChange={(e) => setNestedValue('nominee', 'isMinor', e.target.value)}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {fieldErrors['documents.folder'] ? <div className="onboarding-error">{fieldErrors['documents.folder']}</div> : null}
            {requiredDocs.map((doc) => (
              <div className="upload-row" key={doc.key}>
                <div><strong>{doc.label}</strong> {doc.required ? '*' : '(Optional)'}</div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocUpload(doc.key, file);
                  }}
                  disabled={busy}
                />
                {form.documents[doc.key]?.uploaded ? (
                  <div className="upload-status">Uploaded: {form.documents[doc.key].fileName}</div>
                ) : null}
                <div className="onboarding-error">{fieldErrors[`documents.${doc.key}`]}</div>
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div>
            <p>Please review before final submit.</p>
            <pre>{JSON.stringify(reviewData, null, 2)}</pre>
          </div>
        )}

        <div className="onboarding-actions">
          <button className="onboarding-btn secondary" onClick={handleBack} disabled={step === 0 || busy}>
            Back
          </button>
          {step < 4 ? (
            <button className="onboarding-btn primary" onClick={handleNext} disabled={busy}>
              Continue
            </button>
          ) : (
            <button className="onboarding-btn primary" onClick={handleSubmit} disabled={busy}>
              {busy ? 'Submitting...' : 'Submit Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
