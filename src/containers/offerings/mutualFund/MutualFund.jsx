import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './mutualfund.css';
import '../offerings-shared.css';
import ContactModal from '../../../components/contact/contactModal/ContactModal';
import Card from 'react-bootstrap/Card';
import { mutualFundData } from '../../../data';
import mutualFundImg from "../../../assets/illustrations/mutual-fund.svg";

const MutualFund = () => {
    const [modal, setModal] = useState(false);
    const [fundType, setFundType] = useState(false);

    return (
        <div id="mutual-funds" className="mutualfund-container section__padding">
            {modal ? <ContactModal setTheModalState={setModal} fundName={fundType} /> : null}
            <div className="mutualFund-title">
                <h1>
                    Invest <span className="section-heading-focus">Hub</span>
                </h1>
            </div>
            <div className="mutual-funds-main">
                <div className="mutual-funds-heading">
                    <div className="mutual-fund-heading-explanation" data-aos="zoom-in-right" data-aos-duration="1000">
                        <div className="whyanupaat-subheading">
                            <h2 className="secondary-heading">
                                Elemental portfolios, mutual fund explorer, and market insights — in one flow.
                            </h2>
                        </div>
                        <div className="mutual-funds-description">
                            <p>
                                Start with Elemental baskets or discover funds in the Mutual Fund Explorer. Track market
                                signals in Screeners Hub, Sector Rotation dashboard, and MarketCompass — then take action
                                with clarity.
                            </p>
                        </div>
                        <div className="mutual-funds-btn">
                            <Link to="/invest/baskets" className="btn">Explore Elemental Baskets</Link>
                            <Link to="/invest" className="btn btn-secondary">Open Mutual Fund Explorer</Link>
                        </div>
                    </div>
                </div>
                <div className="mutual-funds-title-image" data-aos="zoom-in-left" data-aos-duration="1000">
                    <picture>
                        <img src={mutualFundImg} alt="Mutual fund illustration" className="hero-illustration mutual-fund-illustration" />
                    </picture>
                </div>
            </div>

            <section className="invest-flow-grid">
                <article className="invest-flow-card invest-flow-card--featured">
                    <h3>Elemental Baskets</h3>
                    <p>Goal-based curated portfolios with guided onboarding and one-time unlock.</p>
                    <Link to="/invest/baskets" className="invest-flow-link">Go to Elemental Baskets →</Link>
                </article>
                <article className="invest-flow-card">
                    <h3>Mutual Fund Explorer</h3>
                    <p>Filter direct funds by category, AMC, return profile, and fund-level details.</p>
                    <Link to="/invest" className="invest-flow-link">Open MF Explorer →</Link>
                </article>
                <article className="invest-flow-card">
                    <h3>Screeners Hub</h3>
                    <p>Live market snapshot, breadth, mood index, and deal/announcement intelligence.</p>
                    <Link to="/screeners" className="invest-flow-link">Open Screeners Hub →</Link>
                </article>
                <article className="invest-flow-card">
                    <h3>Sector Rotation Dashboard</h3>
                    <p>Relative strength trends to identify sector leadership shifts.</p>
                    <Link to="/screeners/sector-rotation" className="invest-flow-link">Open Sector Rotation →</Link>
                </article>
                <article className="invest-flow-card">
                    <h3>MarketCompass</h3>
                    <p>Macro and valuation context to align deployment decisions.</p>
                    <Link to="/valuation" className="invest-flow-link">Open MarketCompass →</Link>
                </article>
                <article className="invest-flow-card">
                    <h3>Fixed Income &amp; Alternatives</h3>
                    <p>FD, bonds, unlisted stocks, and P2P lending — consultation-first discovery.</p>
                    <Link to="/fixed-income-alternatives" className="invest-flow-link">Explore products →</Link>
                </article>
            </section>

            <section className="legacy-baskets">
                <div className="legacy-baskets__head">
                    <h2>Legacy Mutual Fund Baskets</h2>
                    <p>
                        Existing baskets are preserved. Elemental portfolios are now the primary journey, while legacy
                        baskets remain available below.
                    </p>
                </div>
                <div className="mutualFund-wrapper">
                    <div className="mutualfund-Card-container">
                        {mutualFundData.map(({ icon, title, description, hreturn, ihorizon, mode, lockin, riskprofile, color }, id) => (
                            <Card className="mutualfund_data" key={id}>
                                <div className="card-info">
                                    <div className="card-title">
                                        <img src={icon} alt={`${title} icon`} />
                                        <h3>{title}</h3>
                                    </div>
                                    <p className="card-subtext">{description}</p>
                                    <div className="mutualcard-body">
                                        <div>
                                            <h3 id="sub-heading">Historical Return</h3>
                                            <p className="data-value">{hreturn}</p>
                                        </div>
                                        <div>
                                            <h3 id="sub-heading">Investment Horizon</h3>
                                            <p className="data-value">{ihorizon}</p>
                                        </div>
                                        <div>
                                            <h3 id="sub-heading">Investment Mode</h3>
                                            <p className="data-value">{mode}</p>
                                        </div>
                                        <div>
                                            <h3 id="sub-heading">LOCK-IN</h3>
                                            <p className="data-value">{lockin}</p>
                                        </div>
                                    </div>
                                    <small className="alert-message">
                                        *Risk profile: <span className="risk-profile" style={{ color }}>{riskprofile}</span>
                                    </small>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <div className="footer">
                <h2>Ready to start your investing journey?</h2>
                <div className="footer-cta-row">
                    <Link to="/invest/baskets" className="btn-invest-now">Elemental Baskets</Link>
                    <Link to="/invest" className="btn-invest-now btn-invest-now--ghost">Mutual Fund Explorer</Link>
                </div>
                <button
                    type="button"
                    className="btn-invest-now btn-invest-now--outline"
                    onClick={(e) => {
                        setModal(true);
                        setFundType(e.target.dataset.fundType);
                    }}
                >
                    Talk to advisor
                </button>
            </div>
        </div >
    );
};

export default MutualFund;