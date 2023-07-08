import React, { useState } from 'react'
import './mutualfund.css';
import ContactModal from '../../../components/contact/contactModal/ContactModal';
import Card from 'react-bootstrap/Card';
import { mutualFundData } from '../../../data';
import {
    Chart, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import mutualFundImg from "../../../assets/illustrations/mutual-fund.svg";



Chart.register(ArcElement, Tooltip, Legend);

const MutualFund = () => {

    const [modal, setModal] = useState(false);
    const [fundType, setFundType] = useState(false);


    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
                fullSize: false,
                labels: {
                    boxWidth: 10,
                    align: 'start',
                }
            },
        }


    };

    return (
        <div id='mutual-funds' className='mutualfund-container section__padding'>
            {modal ? <ContactModal setTheModalState={setModal} fundName={fundType} /> : ''}
            <div className='mutualFund-title'>
                <h1 >Mutual<span className='section-heading-focus'>Funds</span></h1>
            </div>
            <div className='mutual-funds-main'>

                <div className="mutual-funds-heading">

                    <div className='mutual-fund-heading-explanation' data-aos="zoom-in-right" data-aos-duration="1000">
                        <div className='whyanupaat-subheading '>
                            <h2 className='secondary-heading'>Unlock Your Investing Potential with Our Expertly Curated Mutual Fund Basket.  Start Building Your Portfolio Today.</h2>
                        </div>
                        <div className='mutual-funds-description'>
                            <p>
                                Invest in the power of diversification with our expertly crafted mutual fund baskets! With a combination of multiple funds in the Indian equity market, you can embark on your investment journey with confidence.
                                Perfect for first-time investors looking to maximize their gains and minimize their risks.
                                Don't miss out on this incredible opportunity - start investing now!
                            </p></div>
                        <div className='mutual-funds-btn'>
                            <a href='/contact' className='btn'>Contact Us</a>

                        </div>
                    </div>

                </div>
                <div className='mutual-funds-title-image' data-aos="zoom-in-left" data-aos-duration="1000">
                    <picture>
                        <img src={mutualFundImg} alt="Mutual-Fund illustration" className='hero-illustration mutual-fund-illustration' />

                    </picture>
                </div>
            </div>
            <div className='mutualFund-wrapper'>
                <div className='mutualfund-Card-container'>
                    {
                        mutualFundData.map(({ icon, title, description, chart, hreturn, ihorizon, mode, lockin, riskprofile, color }, id) => {
                            return (

                                <Card className="mutualfund_data" key={id}>
                                    <div className="card-info">
                                        <div className='card-title'>
                                            <img src={icon} alt="icon" />
                                            <h3>{title}</h3>
                                        </div>
                                        <p className='card-subtext'>{description}</p>
                                        <div className="mutualcard-body">
                                            <div>
                                                <h3 id='sub-heading'>Historical Return</h3>
                                                <p className='data-value'>{hreturn}</p>
                                            </div>
                                            <div>
                                                <h3 id='sub-heading'>Investment Horizon</h3>
                                                <p className='data-value'>{ihorizon}</p>
                                            </div>
                                            <div>
                                                <h3 id='sub-heading'>Investment Mode</h3>
                                                <p className='data-value'>{mode}</p>
                                            </div>
                                            <div>
                                                <h3 id='sub-heading'>LOCK-IN</h3>
                                                <p className='data-value'>{lockin}</p>
                                            </div>


                                        </div>
                                        <div className='mutualFund-donut-container'>
                                            <Doughnut
                                                data={chart}
                                                options={options}>

                                            </Doughnut>
                                        </div>

                                        <small className='alert-message'>*Risk Profile for this basket is considered <span className='risk-profile' style={{ color: `${color}` }} >{riskprofile}</span></small>


                                    </div>

                                </Card>
                            )
                        })
                    }

                </div>
            </div>
            <div className="footer">
                <h2>Ready to invest? Click <span style={{color:'#FE0101'}}>"Invest Now"</span> and let's get started!</h2>
                <button type="button" className='btn-invest-now' onClick={(e) => {
                    setModal(true);
                    setFundType(e.target.dataset.fundType);
                }}>Invest Now</button>
            </div>


        </div >


    )
}

export default MutualFund