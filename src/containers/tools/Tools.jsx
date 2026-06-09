import React, { useState } from "react";
import "./tools.css";
import { Link } from "react-router-dom";
import { FaCalculator, FaChartPie, FaLayerGroup, FaFileInvoiceDollar, FaHandshake, FaBuilding, FaUniversity, FaLandmark } from "react-icons/fa";

const toolsData = [
  {
    id: "fidok",
    title: "FIDOK",
    description:
      "Financial Information and Document Organizer Kit — structure your records before you invest.",
    icon: FaFileInvoiceDollar,
    action: "modal",
  },
  {
    id: "equity-basket",
    title: "Equity basket builder",
    description: "Explore diversified equity baskets aligned to themes and risk appetite.",
    icon: FaLayerGroup,
    href: "/equity-basket",
  },
  {
    id: "loan-assessment",
    title: "Loan against securities",
    description: "Understand how securities-backed loans work and when they may fit your plan.",
    icon: FaChartPie,
    href: "/loan-against-securities",
  },
  {
    id: "mf-selector",
    title: "Mutual fund baskets",
    description: "Curated mutual fund baskets with clear risk labels and horizons.",
    icon: FaCalculator,
    href: "/mutual-funds",
  },
  {
    id: "p2p-lending",
    title: "P2P lending",
    description: "Understand peer-to-peer lending platforms, risk, and diversification.",
    icon: FaHandshake,
    href: "/p2p-lending",
  },
  {
    id: "unlisted-stocks",
    title: "Unlisted stocks",
    description: "Explore pre-IPO and private market equity with a research-led approach.",
    icon: FaBuilding,
    href: "/unlisted-stocks",
  },
  {
    id: "fixed-deposits",
    title: "Fixed deposits",
    description: "Compare bank and NBFC FDs on safety, tenure, and post-tax yield.",
    icon: FaUniversity,
    href: "/fixed-deposits",
  },
  {
    id: "bonds",
    title: "Bonds & debentures",
    description: "Government and corporate bonds for steady income and diversification.",
    icon: FaLandmark,
    href: "/bonds",
  },
];

const Tools = () => {
  const [showModal, setShowModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = { name: clientName, email: clientEmail, mobile };
    try {
      await saveToGoogleSheet(formData);
      alert("Thank you! The FIDOK Tool has been sent to your email.");
      setClientName("");
      setClientEmail("");
      setMobile("");
      setShowModal(false);
    } catch (error) {
      alert("There was an issue submitting your request. Please try again.");
    }
  };

  const saveToGoogleSheet = async (data) => {
    const sheetId = "1f8znptWwqldOXeY5w3_Qo9a1ky0AAAFzt_4oHJEbZq8";
    const apiKey = "AIzaSyAN6b7Ce_khLDghjzmvIoylQqGhfWwt5Ro";
    const range = "FIDOK!A1";
    const body = { values: [[data.name, data.mobile, data.email]] };
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error?.message || "Sheet append failed");
    }
  };

  return (
    <div className="tools-page section__padding section__margin">
      <header className="tools-hero">
        <p className="tools-eyebrow">Insights &amp; utilities</p>
        <h1>
          Tools built for <span className="section-heading-focus">clarity</span>
        </h1>
        <p className="tools-lede">
          Calculators, organisers, and guided journeys — the same disciplined lens we use in advisory,
          packaged so you can explore at your own pace.
        </p>
        <div className="tools-hero-actions">
          <Link to="/calculators" className="tools-btn tools-btn--primary">
            <FaCalculator aria-hidden /> Smart calculators
          </Link>
          <Link to="/valuation" className="tools-btn tools-btn--ghost">
            MarketCompass
          </Link>
        </div>
      </header>

      <section className="tools-grid-section" aria-label="Tool directory">
        <div className="tools-grid">
          {toolsData.map((tool) => {
            const Icon = tool.icon;
            const isModal = tool.action === "modal";
            return (
              <article key={tool.id} className="tools-card">
                <div className="tools-card-icon" aria-hidden>
                  <Icon />
                </div>
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
                {isModal ? (
                  <button type="button" className="tools-card-cta" onClick={() => setShowModal(true)}>
                    Request FIDOK
                  </button>
                ) : (
                  <Link to={tool.href} className="tools-card-cta tools-card-cta--link">
                    Open
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {showModal ? (
        <div className="tools-modal" role="dialog" aria-modal="true" aria-labelledby="fidok-modal-title">
          <div className="tools-modal-panel">
            <button type="button" className="tools-modal-close" onClick={() => setShowModal(false)} aria-label="Close">
              ×
            </button>
            <h2 id="fidok-modal-title">Access FIDOK</h2>
            <p className="tools-modal-note">Share your details — we will send the organizer kit to your inbox.</p>
            <form className="tools-modal-form" onSubmit={handleFormSubmit}>
              <label>
                Name
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
              </label>
              <label>
                Mobile
                <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required />
              </label>
              <div className="tools-modal-actions">
                <button type="submit" className="tools-btn tools-btn--primary">
                  Submit
                </button>
                <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Tools;
