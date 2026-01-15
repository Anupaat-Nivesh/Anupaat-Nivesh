import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { FaCalculator, FaChartLine } from "react-icons/fa";
import "./calculators.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// Register plugin for percentage labels on bar charts
const percentageLabelPlugin = {
  id: "percentageLabel",
  afterDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    
    // Get datasets
    const investedMeta = chart.getDatasetMeta(0);
    const returnsMeta = chart.getDatasetMeta(1);
    
    if (!investedMeta || !returnsMeta) return;
    
    // Calculate percentages from chart data (these are already percentages)
    const investedPercent = chart.data.datasets[0].data[0];
    const returnsPercent = chart.data.datasets[1].data[0];
    
    // Calculate center Y position
    const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
    
    // Get the scale to convert percentage to pixel position
    const xScale = chart.scales.x;
    const chartWidth = chartArea.right - chartArea.left;
    
    // Draw percentage for invested segment (left segment)
    if (investedMeta.data && investedMeta.data.length > 0 && investedPercent > 0) {
      const investedBar = investedMeta.data[0];
      if (investedBar) {
        // For horizontal stacked bars, calculate center based on percentage
        // Invested segment goes from 0 to investedPercent
        const investedWidthPixels = (investedPercent / 100) * chartWidth;
        const investedCenterX = chartArea.left + (investedWidthPixels / 2);
        
        // Only draw if there's enough space (at least 5% width)
        if (investedPercent >= 5) {
          ctx.save();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 16px Arial, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 4;
          ctx.fillText(
            `${Math.round(investedPercent)}%`,
            investedCenterX,
            centerY
          );
          ctx.restore();
        }
      }
    }
    
    // Draw percentage for returns segment (right segment - stacked after invested)
    if (returnsMeta.data && returnsMeta.data.length > 0 && returnsPercent > 0) {
      const returnsBar = returnsMeta.data[0];
      if (returnsBar) {
        // Returns segment starts at investedPercent and goes to 100%
        const returnsStartPixels = (investedPercent / 100) * chartWidth;
        const returnsWidthPixels = (returnsPercent / 100) * chartWidth;
        const returnsCenterX = chartArea.left + returnsStartPixels + (returnsWidthPixels / 2);
        
        // Only draw if there's enough space (at least 5% width)
        if (returnsPercent >= 5) {
          ctx.save();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 16px Arial, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 4;
          ctx.fillText(
            `${Math.round(returnsPercent)}%`,
            returnsCenterX,
            centerY
          );
          ctx.restore();
        }
      }
    }
  },
};

ChartJS.register(percentageLabelPlugin);

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatNumber = (value) => currencyFormatter.format(Math.round(value || 0));

// Format number with Indian comma separator (e.g., 10000 -> "10,000", 1000000 -> "10,00,000")
const formatIndianNumber = (value) => {
  if (!value && value !== 0) return "";
  const numStr = value.toString().replace(/,/g, "");
  const num = parseFloat(numStr);
  if (isNaN(num)) return "";
  
  // Indian numbering system: first 3 digits, then groups of 2
  const parts = numStr.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  let formatted = "";
  const len = integerPart.length;
  
  if (len <= 3) {
    formatted = integerPart;
  } else {
    // Last 3 digits
    formatted = integerPart.slice(-3);
    // Remaining digits in groups of 2
    for (let i = len - 3; i > 0; i -= 2) {
      const start = Math.max(0, i - 2);
      formatted = integerPart.slice(start, i) + "," + formatted;
    }
  }
  
  return decimalPart ? formatted + "." + decimalPart : formatted;
};

// Parse Indian formatted number back to number
const parseIndianNumber = (value) => {
  if (!value) return 0;
  const cleaned = value.toString().replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const calculateSip = (monthly, rate, years) => {
  const n = Math.max(0, Math.floor(years * 12));
  const r = rate / 12 / 100;
  if (n === 0 || monthly <= 0) return { maturity: 0, invested: 0, returns: 0 };

  let maturity;
  if (r === 0) {
    maturity = monthly * n;
  } else {
    maturity = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  }
  const invested = monthly * n;
  return { maturity, invested, returns: maturity - invested };
};

const calculateStepUpSip = (monthly, rate, years, stepPercent) => {
  const n = Math.max(0, Math.floor(years * 12));
  const r = rate / 12 / 100;
  const step = stepPercent / 100;
  if (n === 0 || monthly <= 0) return { maturity: 0, invested: 0, returns: 0 };

  let maturity = 0;
  let invested = 0;

  for (let m = 0; m < n; m++) {
    const yearIndex = Math.floor(m / 12);
    const contribution = monthly * Math.pow(1 + step, yearIndex);
    const monthsLeft = n - m - 1; // contribution made at start of month
    invested += contribution;
    if (r === 0) {
      maturity += contribution;
    } else {
      maturity += contribution * Math.pow(1 + r, monthsLeft + 1);
    }
  }

  return { maturity, invested, returns: maturity - invested };
};

const calculateLumpsum = (principal, rate, years) => {
  const r = rate / 100;
  const maturity = principal * Math.pow(1 + r, years);
  return {
    maturity,
    invested: principal,
    returns: maturity - principal,
  };
};

const calculatePresentValue = (futureValue, rate, years) => {
  const r = rate / 100;
  const pv = futureValue / Math.pow(1 + r, years);
  return {
    presentValue: pv,
    futureValue,
    growth: futureValue - pv,
  };
};

// SWP Calculator - Calculate systematic withdrawal plan
const calculateSWP = (corpus, withdrawalPercent, rate, years) => {
  const monthlyRate = rate / 12 / 100;
  const monthlyWithdrawal = (corpus * withdrawalPercent / 100) / 12;
  const months = years * 12;
  
  if (months === 0 || corpus <= 0 || monthlyRate === 0) {
    return {
      monthlyWithdrawal: 0,
      annualWithdrawal: 0,
      remainingCorpus: corpus,
      totalWithdrawn: 0,
      corpusExhausted: false,
      yearsToExhaust: years
    };
  }
  
  // Calculate remaining corpus after withdrawals
  let remainingCorpus = corpus;
  let totalWithdrawn = 0;
  let monthsToExhaust = months;
  let corpusExhausted = false;
  
  for (let m = 0; m < months; m++) {
    if (remainingCorpus <= 0) {
      corpusExhausted = true;
      monthsToExhaust = m;
      break;
    }
    
    // Growth first
    remainingCorpus = remainingCorpus * (1 + monthlyRate);
    
    // Then withdrawal
    if (remainingCorpus >= monthlyWithdrawal) {
      remainingCorpus -= monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
    } else {
      totalWithdrawn += remainingCorpus;
      remainingCorpus = 0;
      corpusExhausted = true;
      monthsToExhaust = m + 1;
      break;
    }
  }
  
  return {
    monthlyWithdrawal,
    annualWithdrawal: monthlyWithdrawal * 12,
    remainingCorpus: Math.max(0, remainingCorpus),
    totalWithdrawn,
    corpusExhausted,
    yearsToExhaust: monthsToExhaust / 12,
    withdrawalPercent
  };
};

// Term Insurance Calculator - Calculate required coverage
const calculateTermInsurance = (currentAge, retirementAge, annualIncome, existingCoverage, liabilities, dependents) => {
  const yearsToRetirement = retirementAge - currentAge;
  
  // Rule of thumb: 10-15x annual income + liabilities - existing coverage
  const incomeMultiplier = dependents > 0 ? 12 : 8; // Higher multiplier if dependents
  const recommendedCoverage = (annualIncome * incomeMultiplier) + liabilities - existingCoverage;
  
  // Alternative: Human Life Value approach
  const futureIncome = annualIncome * yearsToRetirement;
  const humanLifeValue = Math.max(0, futureIncome + liabilities - existingCoverage);
  
  return {
    recommendedCoverage: Math.max(0, recommendedCoverage),
    humanLifeValue: Math.max(0, humanLifeValue),
    yearsToRetirement,
    incomeMultiplier
  };
};

// Home Loan Calculator - Calculate loan amount based on EMI
const calculateHomeLoan = (emi, rate, tenureYears) => {
  const monthlyRate = rate / 12 / 100;
  const months = tenureYears * 12;
  
  if (months === 0 || emi <= 0 || monthlyRate === 0) {
    return {
      loanAmount: 0,
      totalPayment: emi * months,
      totalInterest: 0
    };
  }
  
  // Calculate loan amount from EMI: EMI = P * [r(1+r)^n] / [(1+r)^n - 1]
  // Rearranging: P = EMI * [(1+r)^n - 1] / [r(1+r)^n]
  const numerator = Math.pow(1 + monthlyRate, months) - 1;
  const denominator = monthlyRate * Math.pow(1 + monthlyRate, months);
  const loanAmount = emi * (numerator / denominator);
  
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;
  
  return {
    loanAmount,
    totalPayment,
    totalInterest,
    emi,
    tenureYears
  };
};

// EMI Calculator - Calculate EMI for any loan
const calculateEMI = (principal, rate, tenureYears) => {
  const monthlyRate = rate / 12 / 100;
  const months = tenureYears * 12;
  
  if (months === 0 || principal <= 0) {
    return {
      emi: 0,
      totalPayment: 0,
      totalInterest: 0
    };
  }
  
  if (monthlyRate === 0) {
    return {
      emi: principal / months,
      totalPayment: principal,
      totalInterest: 0
    };
  }
  
  // EMI = P * [r(1+r)^n] / [(1+r)^n - 1]
  const emi = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  
  return {
    emi,
    totalPayment,
    totalInterest,
    principal
  };
};

// Retirement Planning Calculator
const calculateRetirement = (currentAge, retirementAge, currentExpenses, inflation, expectedReturn, lifeExpectancy) => {
  const yearsToRetirement = retirementAge - currentAge;
  const retirementYears = lifeExpectancy - retirementAge;
  
  // Calculate future expenses at retirement (with inflation)
  const futureMonthlyExpenses = currentExpenses * Math.pow(1 + inflation / 100, yearsToRetirement);
  const annualExpensesAtRetirement = futureMonthlyExpenses * 12;
  
  // Calculate corpus needed (considering inflation during retirement)
  // Using present value of annuity formula adjusted for inflation
  const realReturn = (expectedReturn - inflation) / (1 + inflation / 100);
  let corpusNeeded = 0;
  
  if (realReturn > 0) {
    // Corpus = Annual Expense * [(1 - (1+r)^-n) / r] where r is real return
    corpusNeeded = annualExpensesAtRetirement * ((1 - Math.pow(1 + realReturn / 100, -retirementYears)) / (realReturn / 100));
  } else {
    // If real return is negative or zero, just multiply by years
    corpusNeeded = annualExpensesAtRetirement * retirementYears;
  }
  
  // Calculate monthly SIP needed to achieve this corpus
  const monthlyRate = expectedReturn / 12 / 100;
  const months = yearsToRetirement * 12;
  let monthlySIP = 0;
  
  if (monthlyRate > 0 && months > 0) {
    // SIP = Corpus / [((1+r)^n - 1) / r * (1+r)]
    const sipFactor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    monthlySIP = corpusNeeded / sipFactor;
  } else {
    monthlySIP = corpusNeeded / months;
  }
  
  return {
    corpusNeeded,
    monthlySIP,
    futureMonthlyExpenses,
    yearsToRetirement,
    retirementYears
  };
};

// Child Education Planning Calculator
const calculateChildEducation = (childAge, targetAge, currentCost, inflation, expectedReturn, yearsOfEducation) => {
  const yearsToTarget = targetAge - childAge;
  
  // Calculate future cost at target age (with inflation)
  const futureCostAtTarget = currentCost * Math.pow(1 + inflation / 100, yearsToTarget);
  
  // Calculate total cost for all years of education (with inflation each year)
  let totalCost = 0;
  for (let year = 0; year < yearsOfEducation; year++) {
    totalCost += futureCostAtTarget * Math.pow(1 + inflation / 100, year);
  }
  
  // Calculate monthly SIP needed
  const monthlyRate = expectedReturn / 12 / 100;
  const months = yearsToTarget * 12;
  let monthlySIP = 0;
  
  if (monthlyRate > 0 && months > 0) {
    const sipFactor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    monthlySIP = totalCost / sipFactor;
  } else {
    monthlySIP = totalCost / months;
  }
  
  return {
    totalCost,
    monthlySIP,
    futureCostAtTarget,
    yearsToTarget
  };
};

// Goal Planning Calculator
const calculateGoalPlanning = (goalAmount, currentAge, targetAge, expectedReturn, existingInvestment) => {
  const yearsToGoal = targetAge - currentAge;
  
  // Calculate how much existing investment will grow
  const futureValueOfExisting = existingInvestment * Math.pow(1 + expectedReturn / 100, yearsToGoal);
  
  // Calculate shortfall
  const shortfall = Math.max(0, goalAmount - futureValueOfExisting);
  
  // Calculate monthly SIP needed for shortfall
  const monthlyRate = expectedReturn / 12 / 100;
  const months = yearsToGoal * 12;
  let monthlySIP = 0;
  
  if (monthlyRate > 0 && months > 0 && shortfall > 0) {
    const sipFactor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    monthlySIP = shortfall / sipFactor;
  } else if (shortfall > 0) {
    monthlySIP = shortfall / months;
  }
  
  return {
    goalAmount,
    futureValueOfExisting,
    shortfall,
    monthlySIP,
    yearsToGoal
  };
};

// Inflation Calculator
const calculateInflation = (currentAmount, inflation, years) => {
  const futureValue = currentAmount * Math.pow(1 + inflation / 100, years);
  const purchasingPowerLoss = futureValue - currentAmount;
  const purchasingPowerPercent = (currentAmount / futureValue) * 100;
  
  return {
    currentAmount,
    futureValue,
    purchasingPowerLoss,
    purchasingPowerPercent,
    years
  };
};

const buildSeries = (fn, years, step = 1) => {
  const labels = [];
  const data = [];
  for (let y = 0; y <= years; y += step) {
    labels.push(`Year ${y}`);
    data.push(fn(y));
  }
  return { labels, data };
};

const ResultCard = ({ title, maturity, invested, returns }) => (
  <div className="calc-result">
    <h4>{title}</h4>
    <div className="result-grid">
      <div>
        <p className="result-label">Maturity value</p>
        <p className="result-value">{formatNumber(maturity)}</p>
      </div>
      <div>
        <p className="result-label">Total invested</p>
        <p className="result-value invested-amount">{formatNumber(invested)}</p>
      </div>
      <div>
        <p className="result-label">Estimated returns</p>
        <p className="result-value success">{formatNumber(returns)}</p>
      </div>
    </div>
  </div>
);

const Calculators = () => {
  const [sipInputs, setSipInputs] = useState({
    monthly: 10000,
    rate: 12,
    years: 10,
  });

  const [stepInputs, setStepInputs] = useState({
    monthly: 10000,
    rate: 12,
    years: 10,
    step: 10,
  });

  const [lumpsumInputs, setLumpsumInputs] = useState({
    principal: 1000000,
    rate: 12,
    years: 10,
  });

  const [pvInputs, setPvInputs] = useState({
    futureValue: 1000000,
    rate: 12,
    years: 10,
  });

  const [swpInputs, setSwpInputs] = useState({
    corpus: 10000000,
    withdrawalPercent: 8,
    rate: 7,
    years: 20,
  });

  const [termInsuranceInputs, setTermInsuranceInputs] = useState({
    currentAge: 35,
    retirementAge: 60,
    annualIncome: 1000000,
    existingCoverage: 0,
    liabilities: 500000,
    dependents: 1,
  });

  const [homeLoanInputs, setHomeLoanInputs] = useState({
    emi: 50000,
    rate: 8.5,
    tenureYears: 20,
  });

  const [emiInputs, setEmiInputs] = useState({
    principal: 5000000,
    rate: 9,
    tenureYears: 20,
  });

  const [retirementInputs, setRetirementInputs] = useState({
    currentAge: 35,
    retirementAge: 60,
    currentExpenses: 50000,
    inflation: 6,
    expectedReturn: 12,
    lifeExpectancy: 85,
  });

  const [educationInputs, setEducationInputs] = useState({
    childAge: 5,
    targetAge: 18,
    currentCost: 1000000,
    inflation: 8,
    expectedReturn: 12,
    yearsOfEducation: 4,
  });

  const [goalInputs, setGoalInputs] = useState({
    goalAmount: 5000000,
    currentAge: 30,
    targetAge: 45,
    expectedReturn: 12,
    existingInvestment: 500000,
  });

  const [inflationInputs, setInflationInputs] = useState({
    currentAmount: 100000,
    inflation: 6,
    years: 10,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "sip");

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Update URL when tab changes (but don't replace if coming from menu)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    // Scroll to top of calculator section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sipResult = useMemo(
    () =>
      calculateSip(
        Number(sipInputs.monthly),
        Number(sipInputs.rate),
        Number(sipInputs.years)
      ),
    [sipInputs]
  );

  const stepResult = useMemo(
    () =>
      calculateStepUpSip(
        Number(stepInputs.monthly),
        Number(stepInputs.rate),
        Number(stepInputs.years),
        Number(stepInputs.step)
      ),
    [stepInputs]
  );

  const lumpsumResult = useMemo(
    () =>
      calculateLumpsum(
        Number(lumpsumInputs.principal),
        Number(lumpsumInputs.rate),
        Number(lumpsumInputs.years)
      ),
    [lumpsumInputs]
  );

  const pvResult = useMemo(
    () =>
      calculatePresentValue(
        Number(pvInputs.futureValue),
        Number(pvInputs.rate),
        Number(pvInputs.years)
      ),
    [pvInputs]
  );

  const swpResult = useMemo(
    () =>
      calculateSWP(
        Number(swpInputs.corpus),
        Number(swpInputs.withdrawalPercent),
        Number(swpInputs.rate),
        Number(swpInputs.years)
      ),
    [swpInputs]
  );

  const termInsuranceResult = useMemo(
    () =>
      calculateTermInsurance(
        Number(termInsuranceInputs.currentAge),
        Number(termInsuranceInputs.retirementAge),
        Number(termInsuranceInputs.annualIncome),
        Number(termInsuranceInputs.existingCoverage),
        Number(termInsuranceInputs.liabilities),
        Number(termInsuranceInputs.dependents)
      ),
    [termInsuranceInputs]
  );

  const homeLoanResult = useMemo(
    () =>
      calculateHomeLoan(
        Number(homeLoanInputs.emi),
        Number(homeLoanInputs.rate),
        Number(homeLoanInputs.tenureYears)
      ),
    [homeLoanInputs]
  );

  const emiResult = useMemo(
    () =>
      calculateEMI(
        Number(emiInputs.principal),
        Number(emiInputs.rate),
        Number(emiInputs.tenureYears)
      ),
    [emiInputs]
  );

  const retirementResult = useMemo(
    () =>
      calculateRetirement(
        Number(retirementInputs.currentAge),
        Number(retirementInputs.retirementAge),
        Number(retirementInputs.currentExpenses),
        Number(retirementInputs.inflation),
        Number(retirementInputs.expectedReturn),
        Number(retirementInputs.lifeExpectancy)
      ),
    [retirementInputs]
  );

  const educationResult = useMemo(
    () =>
      calculateChildEducation(
        Number(educationInputs.childAge),
        Number(educationInputs.targetAge),
        Number(educationInputs.currentCost),
        Number(educationInputs.inflation),
        Number(educationInputs.expectedReturn),
        Number(educationInputs.yearsOfEducation)
      ),
    [educationInputs]
  );

  const goalResult = useMemo(
    () =>
      calculateGoalPlanning(
        Number(goalInputs.goalAmount),
        Number(goalInputs.currentAge),
        Number(goalInputs.targetAge),
        Number(goalInputs.expectedReturn),
        Number(goalInputs.existingInvestment)
      ),
    [goalInputs]
  );

  const inflationResult = useMemo(
    () =>
      calculateInflation(
        Number(inflationInputs.currentAmount),
        Number(inflationInputs.inflation),
        Number(inflationInputs.years)
      ),
    [inflationInputs]
  );

  const sipSeries = useMemo(() => {
    const { labels, data } = buildSeries(
      (y) =>
        calculateSip(
          Number(sipInputs.monthly),
          Number(sipInputs.rate),
          Number(y)
        ).maturity,
      Number(sipInputs.years),
      1
    );
    return { labels, data };
  }, [sipInputs]);

  const stepSeries = useMemo(() => {
    const { labels, data } = buildSeries(
      (y) =>
        calculateStepUpSip(
          Number(stepInputs.monthly),
          Number(stepInputs.rate),
          Number(y),
          Number(stepInputs.step)
        ).maturity,
      Number(stepInputs.years),
      1
    );
    return { labels, data };
  }, [stepInputs]);

  const lumpsumSeries = useMemo(() => {
    const { labels, data } = buildSeries(
      (y) =>
        calculateLumpsum(
          Number(lumpsumInputs.principal),
          Number(lumpsumInputs.rate),
          Number(y)
        ).maturity,
      Number(lumpsumInputs.years),
      1
    );
    return { labels, data };
  }, [lumpsumInputs]);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    // For amount fields, parse Indian formatted numbers
    const amountFields = ["monthly", "principal", "futureValue", "corpus", "annualIncome", "existingCoverage", "liabilities", "emi", "currentExpenses", "currentCost", "goalAmount", "existingInvestment", "currentAmount"];
    if (amountFields.includes(name)) {
      const parsedValue = parseIndianNumber(value);
      setter((prev) => ({ ...prev, [name]: parsedValue }));
    } else {
      setter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (setter, fieldName) => (e) => {
    // Format on blur for amount fields
    const amountFields = ["monthly", "principal", "futureValue", "corpus", "annualIncome", "existingCoverage", "liabilities", "emi", "currentExpenses", "currentCost", "goalAmount", "existingInvestment", "currentAmount"];
    if (amountFields.includes(fieldName)) {
      const value = e.target.value;
      const parsed = parseIndianNumber(value);
      setter((prev) => ({ ...prev, [fieldName]: parsed }));
    }
  };

  // Memoized bar chart data for SIP
  const sipBarData = useMemo(() => {
    const total = sipResult.invested + sipResult.returns;
    const investedPercent = total > 0 ? (sipResult.invested / total) * 100 : 0;
    const returnsPercent = total > 0 ? (sipResult.returns / total) * 100 : 0;

    return {
      labels: [""],
      datasets: [
        {
          label: "Invested",
          data: [investedPercent],
          backgroundColor: "rgba(220, 53, 69, 0.9)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 0,
          borderRadius: 8,
        },
        {
          label: "Returns",
          data: [returnsPercent],
          backgroundColor: "rgba(40, 167, 69, 0.9)",
          borderColor: "rgba(40, 167, 69, 1)",
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    };
  }, [sipResult.invested, sipResult.returns]);

  // Memoized bar chart data for Step-up SIP
  const stepBarData = useMemo(() => {
    const total = stepResult.invested + stepResult.returns;
    const investedPercent = total > 0 ? (stepResult.invested / total) * 100 : 0;
    const returnsPercent = total > 0 ? (stepResult.returns / total) * 100 : 0;

    return {
      labels: [""],
      datasets: [
        {
          label: "Invested",
          data: [investedPercent],
          backgroundColor: "rgba(220, 53, 69, 0.9)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 0,
          borderRadius: 8,
        },
        {
          label: "Returns",
          data: [returnsPercent],
          backgroundColor: "rgba(40, 167, 69, 0.9)",
          borderColor: "rgba(40, 167, 69, 1)",
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    };
  }, [stepResult.invested, stepResult.returns]);

  // Memoized bar chart data for Lumpsum
  const lumpsumBarData = useMemo(() => {
    const total = lumpsumResult.invested + lumpsumResult.returns;
    const investedPercent = total > 0 ? (lumpsumResult.invested / total) * 100 : 0;
    const returnsPercent = total > 0 ? (lumpsumResult.returns / total) * 100 : 0;

    return {
      labels: [""],
      datasets: [
        {
          label: "Invested",
          data: [investedPercent],
          backgroundColor: "rgba(220, 53, 69, 0.9)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 0,
          borderRadius: 8,
        },
        {
          label: "Returns",
          data: [returnsPercent],
          backgroundColor: "rgba(40, 167, 69, 0.9)",
          borderColor: "rgba(40, 167, 69, 1)",
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    };
  }, [lumpsumResult.invested, lumpsumResult.returns]);

  // Shared bar chart options
  const barOptions = useMemo(() => ({
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false,
        max: 100,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: "easeInOutQuart",
    },
  }), []);

  return (
    <div className="calculators-page section__padding section__margin">
      <div className="calc-header">
        <div className="calc-header-content">
          <div className="calc-header-text">
            <p className="eyebrow">Plan with confidence</p>
            <h1>
              Smart <span className="section-heading-focus">Calculators</span> for
              your goals
            </h1>
            <p className="lead">
              Estimate SIPs, model step-ups, project lumpsums, and size today's investment
              for future goals—so you can make data-backed decisions with clarity.
            </p>
            <div className="calc-highlights">
              <div className="pill">Goal-aligned projections</div>
              <div className="pill">Invested vs returns breakdown</div>
              <div className="pill">Present value for future targets</div>
            </div>
          </div>
          <div className="calc-header-illustration">
            <div className="calc-icon-wrapper">
              <FaCalculator className="calc-main-icon" />
              <FaChartLine className="calc-chart-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="calc-tabs">
        <button
          className={activeTab === "sip" ? "tab active" : "tab"}
          onClick={() => handleTabChange("sip")}
        >
          SIP
        </button>
        <button
          className={activeTab === "step" ? "tab active" : "tab"}
          onClick={() => handleTabChange("step")}
        >
          Step-up SIP
        </button>
        <button
          className={activeTab === "lumpsum" ? "tab active" : "tab"}
          onClick={() => handleTabChange("lumpsum")}
        >
          Lumpsum
        </button>
        <button
          className={activeTab === "pv" ? "tab active" : "tab"}
          onClick={() => handleTabChange("pv")}
        >
          Time value (PV)
        </button>
        <button
          className={activeTab === "swp" ? "tab active" : "tab"}
          onClick={() => handleTabChange("swp")}
        >
          SWP
        </button>
        <button
          className={activeTab === "term" ? "tab active" : "tab"}
          onClick={() => handleTabChange("term")}
        >
          Term Insurance
        </button>
        <button
          className={activeTab === "homeloan" ? "tab active" : "tab"}
          onClick={() => handleTabChange("homeloan")}
        >
          Home Loan
        </button>
        <button
          className={activeTab === "emi" ? "tab active" : "tab"}
          onClick={() => handleTabChange("emi")}
        >
          EMI
        </button>
        <button
          className={activeTab === "retirement" ? "tab active" : "tab"}
          onClick={() => handleTabChange("retirement")}
        >
          Retirement
        </button>
        <button
          className={activeTab === "education" ? "tab active" : "tab"}
          onClick={() => handleTabChange("education")}
        >
          Child Education
        </button>
        <button
          className={activeTab === "goal" ? "tab active" : "tab"}
          onClick={() => handleTabChange("goal")}
        >
          Goal Planning
        </button>
        <button
          className={activeTab === "inflation" ? "tab active" : "tab"}
          onClick={() => handleTabChange("inflation")}
        >
          Inflation
        </button>
      </div>

      <div className="calc-grid single">
        {activeTab === "sip" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">SIP calculator</p>
                <h3>Plan steady monthly investments</h3>
                <p className="muted">
                  Calculate maturity with fixed monthly SIPs.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Monthly investment (₹)
                <input
                  type="text"
                  name="monthly"
                  value={formatIndianNumber(sipInputs.monthly)}
                  onChange={handleChange(setSipInputs)}
                  onBlur={handleBlur(setSipInputs, "monthly")}
                />
              </label>
              <label>
                Expected annual return (%)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="rate"
                  value={sipInputs.rate}
                  onChange={handleChange(setSipInputs)}
                />
              </label>
              <label>
                Investment duration (years)
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="years"
                  value={sipInputs.years}
                  onChange={handleChange(setSipInputs)}
                />
              </label>
            </div>
            <ResultCard
              title="SIP projection"
              maturity={sipResult.maturity}
              invested={sipResult.invested}
              returns={sipResult.returns}
            />
            <div className="chart-block">
              <Bar
                key={`sip-${sipResult.invested}-${sipResult.returns}`}
                data={sipBarData}
                options={barOptions}
              />
            </div>
          </div>
        )}

        {activeTab === "step" && (
          <div className="calc-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Step-up SIP calculator</p>
              <h3>Grow your SIPs annually</h3>
              <p className="muted">
                Model yearly increases to align with income growth.
              </p>
            </div>
          </div>
          <div className="calc-form">
            <label>
              Starting monthly investment (₹)
              <input
                type="text"
                name="monthly"
                value={formatIndianNumber(stepInputs.monthly)}
                onChange={handleChange(setStepInputs)}
                onBlur={handleBlur(setStepInputs, "monthly")}
              />
            </label>
            <label>
              Expected annual return (%)
              <input
                type="number"
                min="0"
                step="0.1"
                name="rate"
                value={stepInputs.rate}
                onChange={handleChange(setStepInputs)}
              />
            </label>
            <label>
              Investment duration (years)
              <input
                type="number"
                min="0"
                step="1"
                name="years"
                value={stepInputs.years}
                onChange={handleChange(setStepInputs)}
              />
            </label>
            <label>
              Annual step-up (%)
              <input
                type="number"
                min="0"
                step="1"
                name="step"
                value={stepInputs.step}
                onChange={handleChange(setStepInputs)}
              />
            </label>
          </div>
          <ResultCard
            title="Step-up projection"
            maturity={stepResult.maturity}
            invested={stepResult.invested}
            returns={stepResult.returns}
          />
          <div className="chart-block">
            <Bar
              key={`step-${stepResult.invested}-${stepResult.returns}`}
              data={stepBarData}
              options={barOptions}
            />
          </div>
        </div>
        )}

        {activeTab === "lumpsum" && (
          <div className="calc-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Lumpsum calculator</p>
              <h3>Project a one-time investment</h3>
              <p className="muted">
                Estimate future value of a lumpsum over your chosen duration.
              </p>
            </div>
          </div>
          <div className="calc-form">
            <label>
              Investment amount (₹)
              <input
                type="text"
                name="principal"
                value={formatIndianNumber(lumpsumInputs.principal)}
                onChange={handleChange(setLumpsumInputs)}
                onBlur={handleBlur(setLumpsumInputs, "principal")}
              />
            </label>
            <label>
              Expected annual return (%)
              <input
                type="number"
                min="0"
                step="0.1"
                name="rate"
                value={lumpsumInputs.rate}
                onChange={handleChange(setLumpsumInputs)}
              />
            </label>
            <label>
              Investment duration (years)
              <input
                type="number"
                min="0"
                step="1"
                name="years"
                value={lumpsumInputs.years}
                onChange={handleChange(setLumpsumInputs)}
              />
            </label>
          </div>
          <ResultCard
            title="Lumpsum projection"
            maturity={lumpsumResult.maturity}
            invested={lumpsumResult.invested}
            returns={lumpsumResult.returns}
          />
          <div className="chart-block">
            <Bar
              key={`lumpsum-${lumpsumResult.invested}-${lumpsumResult.returns}`}
              data={lumpsumBarData}
              options={barOptions}
            />
          </div>
        </div>
        )}

        {activeTab === "pv" && (
          <div className="calc-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Time value of money</p>
              <h3>Find today’s value of a future goal</h3>
              <p className="muted">
                Calculate how much you need today to reach a future target.
              </p>
            </div>
          </div>
          <div className="calc-form">
            <label>
              Target value (₹)
              <input
                type="text"
                name="futureValue"
                value={formatIndianNumber(pvInputs.futureValue)}
                onChange={handleChange(setPvInputs)}
                onBlur={handleBlur(setPvInputs, "futureValue")}
              />
            </label>
            <label>
              Expected annual return (%)
              <input
                type="number"
                min="0"
                step="0.1"
                name="rate"
                value={pvInputs.rate}
                onChange={handleChange(setPvInputs)}
              />
            </label>
            <label>
              Time horizon (years)
              <input
                type="number"
                min="0"
                step="1"
                name="years"
                value={pvInputs.years}
                onChange={handleChange(setPvInputs)}
              />
            </label>
          </div>
          <div className="calc-result">
            <h4>Present value needed</h4>
            <div className="result-grid">
              <div>
                <p className="result-label">Need today</p>
                <p className="result-value">{formatNumber(pvResult.presentValue)}</p>
              </div>
              <div>
                <p className="result-label">Future goal</p>
                <p className="result-value muted">{formatNumber(pvResult.futureValue)}</p>
              </div>
              <div>
                <p className="result-label">Growth</p>
                <p className="result-value success">{formatNumber(pvResult.growth)}</p>
              </div>
            </div>
          </div>
          </div>
        )}

        {activeTab === "swp" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">SWP Calculator</p>
                <h3>Systematic Withdrawal Plan</h3>
                <p className="muted">
                  Calculate monthly/annual withdrawals from your corpus. Recommended withdrawal: 6-12% annually.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Corpus amount (₹)
                <input
                  type="text"
                  name="corpus"
                  value={formatIndianNumber(swpInputs.corpus)}
                  onChange={handleChange(setSwpInputs)}
                  onBlur={handleBlur(setSwpInputs, "corpus")}
                />
              </label>
              <label>
                Annual withdrawal (%)
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.1"
                  name="withdrawalPercent"
                  value={swpInputs.withdrawalPercent}
                  onChange={handleChange(setSwpInputs)}
                />
                {swpInputs.withdrawalPercent > 12 && (
                  <span style={{ color: '#dc3545', fontSize: '1.2rem', marginTop: '0.4rem' }}>
                    ⚠️ Above 12% may exhaust corpus quickly
                  </span>
                )}
                {swpInputs.withdrawalPercent >= 6 && swpInputs.withdrawalPercent <= 12 && (
                  <span style={{ color: '#28a745', fontSize: '1.2rem', marginTop: '0.4rem' }}>
                    ✓ Recommended range
                  </span>
                )}
                {swpInputs.withdrawalPercent < 6 && (
                  <span style={{ color: '#ffc107', fontSize: '1.2rem', marginTop: '0.4rem' }}>
                    💡 Consider 6-12% for sustainable withdrawals
                  </span>
                )}
              </label>
              <label>
                Expected annual return (%)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="rate"
                  value={swpInputs.rate}
                  onChange={handleChange(setSwpInputs)}
                />
              </label>
              <label>
                Withdrawal period (years)
                <input
                  type="number"
                  min="1"
                  step="1"
                  name="years"
                  value={swpInputs.years}
                  onChange={handleChange(setSwpInputs)}
                />
              </label>
            </div>
            <div className="calc-result">
              <h4>SWP Projection</h4>
              <div className="result-grid">
                <div>
                  <p className="result-label">Monthly withdrawal</p>
                  <p className="result-value">{formatNumber(swpResult.monthlyWithdrawal)}</p>
                </div>
                <div>
                  <p className="result-label">Annual withdrawal</p>
                  <p className="result-value">{formatNumber(swpResult.annualWithdrawal)}</p>
                </div>
                <div>
                  <p className="result-label">Remaining corpus</p>
                  <p className="result-value" style={{ color: swpResult.corpusExhausted ? '#dc3545' : '#28a745' }}>
                    {formatNumber(swpResult.remainingCorpus)}
                  </p>
                </div>
                <div>
                  <p className="result-label">Total withdrawn</p>
                  <p className="result-value success">{formatNumber(swpResult.totalWithdrawn)}</p>
                </div>
                {swpResult.corpusExhausted && (
                  <div style={{ gridColumn: '1 / -1', padding: '1rem', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
                    <p style={{ color: '#856404', fontSize: '1.3rem', fontWeight: 600 }}>
                      ⚠️ Corpus exhausted after {swpResult.yearsToExhaust.toFixed(1)} years
                    </p>
                    <p style={{ color: '#856404', fontSize: '1.2rem', marginTop: '0.5rem' }}>
                      Consider reducing withdrawal rate to 6-12% for sustainability
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "term" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Term Insurance Calculator</p>
                <h3>Calculate your life insurance need</h3>
                <p className="muted">
                  Determine the right coverage amount based on your income, liabilities, and dependents.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Current age (years)
                <input
                  type="number"
                  min="18"
                  max="65"
                  step="1"
                  name="currentAge"
                  value={termInsuranceInputs.currentAge}
                  onChange={handleChange(setTermInsuranceInputs)}
                />
              </label>
              <label>
                Retirement age (years)
                <input
                  type="number"
                  min="50"
                  max="70"
                  step="1"
                  name="retirementAge"
                  value={termInsuranceInputs.retirementAge}
                  onChange={handleChange(setTermInsuranceInputs)}
                />
              </label>
              <label>
                Annual income (₹)
                <input
                  type="text"
                  name="annualIncome"
                  value={formatIndianNumber(termInsuranceInputs.annualIncome)}
                  onChange={handleChange(setTermInsuranceInputs)}
                  onBlur={handleBlur(setTermInsuranceInputs, "annualIncome")}
                />
              </label>
              <label>
                Existing coverage (₹)
                <input
                  type="text"
                  name="existingCoverage"
                  value={formatIndianNumber(termInsuranceInputs.existingCoverage)}
                  onChange={handleChange(setTermInsuranceInputs)}
                  onBlur={handleBlur(setTermInsuranceInputs, "existingCoverage")}
                />
              </label>
              <label>
                Liabilities (loans, etc.) (₹)
                <input
                  type="text"
                  name="liabilities"
                  value={formatIndianNumber(termInsuranceInputs.liabilities)}
                  onChange={handleChange(setTermInsuranceInputs)}
                  onBlur={handleBlur(setTermInsuranceInputs, "liabilities")}
                />
              </label>
              <label>
                Number of dependents
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="dependents"
                  value={termInsuranceInputs.dependents}
                  onChange={handleChange(setTermInsuranceInputs)}
                />
              </label>
            </div>
            <div className="calc-result">
              <h4>Insurance Requirement</h4>
              <div className="result-grid">
                <div>
                  <p className="result-label">Recommended coverage</p>
                  <p className="result-value">{formatNumber(termInsuranceResult.recommendedCoverage)}</p>
                  <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '0.4rem' }}>
                    ({termInsuranceResult.incomeMultiplier}x income + liabilities)
                  </p>
                </div>
                <div>
                  <p className="result-label">Human Life Value</p>
                  <p className="result-value muted">{formatNumber(termInsuranceResult.humanLifeValue)}</p>
                  <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '0.4rem' }}>
                    (Future income approach)
                  </p>
                </div>
                <div>
                  <p className="result-label">Years to retirement</p>
                  <p className="result-value">{termInsuranceResult.yearsToRetirement} years</p>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: '#e7f3ff', borderRadius: '8px', border: '1px solid #b3d9ff' }}>
                <p style={{ fontSize: '1.3rem', fontWeight: 600, color: '#004085', marginBottom: '0.5rem' }}>
                  💡 Recommendation
                </p>
                <p style={{ fontSize: '1.2rem', color: '#004085' }}>
                  Consider coverage of <strong>{formatNumber(termInsuranceResult.recommendedCoverage)}</strong> to protect your family's financial future. This covers {termInsuranceResult.yearsToRetirement} years of income replacement plus liabilities.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "homeloan" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Home Loan Calculator</p>
                <h3>Calculate loan amount from EMI</h3>
                <p className="muted">
                  Determine how much home loan you can get based on your EMI capacity and tenure.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Monthly EMI (₹)
                <input
                  type="text"
                  name="emi"
                  value={formatIndianNumber(homeLoanInputs.emi)}
                  onChange={handleChange(setHomeLoanInputs)}
                  onBlur={handleBlur(setHomeLoanInputs, "emi")}
                />
              </label>
              <label>
                Interest rate (% p.a.)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="rate"
                  value={homeLoanInputs.rate}
                  onChange={handleChange(setHomeLoanInputs)}
                />
              </label>
              <label>
                Loan tenure (years)
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  name="tenureYears"
                  value={homeLoanInputs.tenureYears}
                  onChange={handleChange(setHomeLoanInputs)}
                />
              </label>
            </div>
            <div className="calc-result">
              <h4>Loan Details</h4>
              <div className="result-grid">
                <div>
                  <p className="result-label">Loan amount</p>
                  <p className="result-value">{formatNumber(homeLoanResult.loanAmount)}</p>
                </div>
                <div>
                  <p className="result-label">Monthly EMI</p>
                  <p className="result-value invested-amount">{formatNumber(homeLoanResult.emi)}</p>
                </div>
                <div>
                  <p className="result-label">Total payment</p>
                  <p className="result-value muted">{formatNumber(homeLoanResult.totalPayment)}</p>
                </div>
                <div>
                  <p className="result-label">Total interest</p>
                  <p className="result-value">{formatNumber(homeLoanResult.totalInterest)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "emi" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">EMI Calculator</p>
                <h3>Calculate EMI for any loan</h3>
                <p className="muted">
                  Calculate Equated Monthly Installment for Personal, Home, Motor, or any other loan.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Loan amount (₹)
                <input
                  type="text"
                  name="principal"
                  value={formatIndianNumber(emiInputs.principal)}
                  onChange={handleChange(setEmiInputs)}
                  onBlur={handleBlur(setEmiInputs, "principal")}
                />
              </label>
              <label>
                Interest rate (% p.a.)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="rate"
                  value={emiInputs.rate}
                  onChange={handleChange(setEmiInputs)}
                />
              </label>
              <label>
                Loan tenure (years)
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  name="tenureYears"
                  value={emiInputs.tenureYears}
                  onChange={handleChange(setEmiInputs)}
                />
              </label>
            </div>
            <div className="calc-result">
              <h4>EMI Breakdown</h4>
              <div className="result-grid">
                <div>
                  <p className="result-label">Monthly EMI</p>
                  <p className="result-value invested-amount">{formatNumber(emiResult.emi)}</p>
                </div>
                <div>
                  <p className="result-label">Total payment</p>
                  <p className="result-value muted">{formatNumber(emiResult.totalPayment)}</p>
                </div>
                <div>
                  <p className="result-label">Total interest</p>
                  <p className="result-value">{formatNumber(emiResult.totalInterest)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "retirement" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Retirement Planning Calculator</p>
                <h3>Plan for your golden years</h3>
                <p className="muted">
                  Calculate how much corpus you need for retirement and the monthly SIP required to achieve it.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Current age (years)
                <input
                  type="number"
                  min="18"
                  max="65"
                  step="1"
                  name="currentAge"
                  value={retirementInputs.currentAge}
                  onChange={handleChange(setRetirementInputs)}
                />
              </label>
              <label>
                Retirement age (years)
                <input
                  type="number"
                  min="50"
                  max="70"
                  step="1"
                  name="retirementAge"
                  value={retirementInputs.retirementAge}
                  onChange={handleChange(setRetirementInputs)}
                />
              </label>
              <label>
                Current monthly expenses (₹)
                <input
                  type="text"
                  name="currentExpenses"
                  value={formatIndianNumber(retirementInputs.currentExpenses)}
                  onChange={handleChange(setRetirementInputs)}
                  onBlur={handleBlur(setRetirementInputs, "currentExpenses")}
                />
              </label>
              <label>
                Expected inflation (% p.a.)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="inflation"
                  value={retirementInputs.inflation}
                  onChange={handleChange(setRetirementInputs)}
                />
              </label>
              <label>
                Expected return (% p.a.)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="expectedReturn"
                  value={retirementInputs.expectedReturn}
                  onChange={handleChange(setRetirementInputs)}
                />
              </label>
              <label>
                Life expectancy (years)
                <input
                  type="number"
                  min="70"
                  max="100"
                  step="1"
                  name="lifeExpectancy"
                  value={retirementInputs.lifeExpectancy}
                  onChange={handleChange(setRetirementInputs)}
                />
              </label>
            </div>
            <div className="calc-result">
              <h4>Retirement Plan</h4>
              <div className="result-grid">
                <div>
                  <p className="result-label">Corpus needed</p>
                  <p className="result-value">{formatNumber(retirementResult.corpusNeeded)}</p>
                </div>
                <div>
                  <p className="result-label">Monthly SIP required</p>
                  <p className="result-value invested-amount">{formatNumber(retirementResult.monthlySIP)}</p>
                </div>
                <div>
                  <p className="result-label">Future monthly expenses</p>
                  <p className="result-value muted">{formatNumber(retirementResult.futureMonthlyExpenses)}</p>
                </div>
                <div>
                  <p className="result-label">Years to retirement</p>
                  <p className="result-value">{retirementResult.yearsToRetirement} years</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "education" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Child Education Planning</p>
                <h3>Secure your child's future</h3>
                <p className="muted">
                  Calculate how much you need to invest monthly for your child's higher education.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Child's current age (years)
                <input
                  type="number"
                  min="0"
                  max="17"
                  step="1"
                  name="childAge"
                  value={educationInputs.childAge}
                  onChange={handleChange(setEducationInputs)}
                />
              </label>
              <label>
                Target age (when education starts)
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="1"
                  name="targetAge"
                  value={educationInputs.targetAge}
                  onChange={handleChange(setEducationInputs)}
                />
              </label>
              <label>
                Current education cost (₹)
                <input
                  type="text"
                  name="currentCost"
                  value={formatIndianNumber(educationInputs.currentCost)}
                  onChange={handleChange(setEducationInputs)}
                  onBlur={handleBlur(setEducationInputs, "currentCost")}
                />
              </label>
              <label>
                Education inflation (% p.a.)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="inflation"
                  value={educationInputs.inflation}
                  onChange={handleChange(setEducationInputs)}
                />
              </label>
              <label>
                Expected return (% p.a.)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="expectedReturn"
                  value={educationInputs.expectedReturn}
                  onChange={handleChange(setEducationInputs)}
                />
              </label>
              <label>
                Years of education
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  name="yearsOfEducation"
                  value={educationInputs.yearsOfEducation}
                  onChange={handleChange(setEducationInputs)}
                />
              </label>
            </div>
            <div className="calc-result">
              <h4>Education Plan</h4>
              <div className="result-grid">
                <div>
                  <p className="result-label">Total cost needed</p>
                  <p className="result-value">{formatNumber(educationResult.totalCost)}</p>
                </div>
                <div>
                  <p className="result-label">Monthly SIP required</p>
                  <p className="result-value invested-amount">{formatNumber(educationResult.monthlySIP)}</p>
                </div>
                <div>
                  <p className="result-label">Cost at target age</p>
                  <p className="result-value muted">{formatNumber(educationResult.futureCostAtTarget)}</p>
                </div>
                <div>
                  <p className="result-label">Years to save</p>
                  <p className="result-value">{educationResult.yearsToTarget} years</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "goal" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Goal Planning Calculator</p>
                <h3>Plan for your financial goals</h3>
                <p className="muted">
                  Calculate monthly SIP needed to achieve your specific financial goal.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Goal amount (₹)
                <input
                  type="text"
                  name="goalAmount"
                  value={formatIndianNumber(goalInputs.goalAmount)}
                  onChange={handleChange(setGoalInputs)}
                  onBlur={handleBlur(setGoalInputs, "goalAmount")}
                />
              </label>
              <label>
                Current age (years)
                <input
                  type="number"
                  min="18"
                  max="65"
                  step="1"
                  name="currentAge"
                  value={goalInputs.currentAge}
                  onChange={handleChange(setGoalInputs)}
                />
              </label>
              <label>
                Target age (years)
                <input
                  type="number"
                  min="19"
                  max="70"
                  step="1"
                  name="targetAge"
                  value={goalInputs.targetAge}
                  onChange={handleChange(setGoalInputs)}
                />
              </label>
              <label>
                Expected return (% p.a.)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="expectedReturn"
                  value={goalInputs.expectedReturn}
                  onChange={handleChange(setGoalInputs)}
                />
              </label>
              <label>
                Existing investment (₹)
                <input
                  type="text"
                  name="existingInvestment"
                  value={formatIndianNumber(goalInputs.existingInvestment)}
                  onChange={handleChange(setGoalInputs)}
                  onBlur={handleBlur(setGoalInputs, "existingInvestment")}
                />
              </label>
            </div>
            <div className="calc-result">
              <h4>Goal Planning</h4>
              <div className="result-grid">
                <div>
                  <p className="result-label">Goal amount</p>
                  <p className="result-value">{formatNumber(goalResult.goalAmount)}</p>
                </div>
                <div>
                  <p className="result-label">Future value of existing</p>
                  <p className="result-value muted">{formatNumber(goalResult.futureValueOfExisting)}</p>
                </div>
                <div>
                  <p className="result-label">Shortfall</p>
                  <p className="result-value" style={{ color: goalResult.shortfall > 0 ? '#dc3545' : '#28a745' }}>
                    {formatNumber(goalResult.shortfall)}
                  </p>
                </div>
                <div>
                  <p className="result-label">Monthly SIP needed</p>
                  <p className="result-value invested-amount">{formatNumber(goalResult.monthlySIP)}</p>
                </div>
                {goalResult.shortfall <= 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '1rem', background: '#d4edda', borderRadius: '8px', border: '1px solid #28a745' }}>
                    <p style={{ color: '#155724', fontSize: '1.3rem', fontWeight: 600 }}>
                      ✓ Your existing investment is sufficient to achieve this goal!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "inflation" && (
          <div className="calc-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Inflation Calculator</p>
                <h3>Understand purchasing power</h3>
                <p className="muted">
                  See how inflation affects the value of money over time.
                </p>
              </div>
            </div>
            <div className="calc-form">
              <label>
                Current amount (₹)
                <input
                  type="text"
                  name="currentAmount"
                  value={formatIndianNumber(inflationInputs.currentAmount)}
                  onChange={handleChange(setInflationInputs)}
                  onBlur={handleBlur(setInflationInputs, "currentAmount")}
                />
              </label>
              <label>
                Expected inflation (% p.a.)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="inflation"
                  value={inflationInputs.inflation}
                  onChange={handleChange(setInflationInputs)}
                />
              </label>
              <label>
                Time period (years)
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  name="years"
                  value={inflationInputs.years}
                  onChange={handleChange(setInflationInputs)}
                />
              </label>
            </div>
            <div className="calc-result">
              <h4>Inflation Impact</h4>
              <div className="result-grid">
                <div>
                  <p className="result-label">Current value</p>
                  <p className="result-value">{formatNumber(inflationResult.currentAmount)}</p>
                </div>
                <div>
                  <p className="result-label">Future value</p>
                  <p className="result-value muted">{formatNumber(inflationResult.futureValue)}</p>
                </div>
                <div>
                  <p className="result-label">Purchasing power loss</p>
                  <p className="result-value" style={{ color: '#dc3545' }}>
                    {formatNumber(inflationResult.purchasingPowerLoss)}
                  </p>
                </div>
                <div>
                  <p className="result-label">Purchasing power</p>
                  <p className="result-value" style={{ color: '#dc3545' }}>
                    {inflationResult.purchasingPowerPercent.toFixed(1)}%
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '0.4rem' }}>
                    (of current value)
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
                <p style={{ fontSize: '1.3rem', fontWeight: 600, color: '#856404', marginBottom: '0.5rem' }}>
                  💡 Insight
                </p>
                <p style={{ fontSize: '1.2rem', color: '#856404' }}>
                  ₹{formatIndianNumber(inflationResult.currentAmount)} today will have the same purchasing power as ₹{formatIndianNumber(inflationResult.futureValue)} in {inflationResult.years} years. 
                  You'll need to invest to beat inflation and preserve your purchasing power.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculators;

