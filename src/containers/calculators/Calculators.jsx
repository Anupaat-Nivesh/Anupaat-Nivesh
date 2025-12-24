import React, { useMemo, useState } from "react";
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

  const [activeTab, setActiveTab] = useState("sip");

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
    if (name === "monthly" || name === "principal" || name === "futureValue") {
      const parsedValue = parseIndianNumber(value);
      setter((prev) => ({ ...prev, [name]: parsedValue }));
    } else {
      setter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (setter, fieldName) => (e) => {
    // Format on blur for amount fields
    if (fieldName === "monthly" || fieldName === "principal" || fieldName === "futureValue") {
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
          onClick={() => setActiveTab("sip")}
        >
          SIP
        </button>
        <button
          className={activeTab === "step" ? "tab active" : "tab"}
          onClick={() => setActiveTab("step")}
        >
          Step-up SIP
        </button>
        <button
          className={activeTab === "lumpsum" ? "tab active" : "tab"}
          onClick={() => setActiveTab("lumpsum")}
        >
          Lumpsum
        </button>
        <button
          className={activeTab === "pv" ? "tab active" : "tab"}
          onClick={() => setActiveTab("pv")}
        >
          Time value (PV)
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
      </div>
    </div>
  );
};

export default Calculators;

