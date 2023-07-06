import React from 'react'
import './loanagainstsecurities.css'
import Card from 'react-bootstrap/Card';
import medicalIcon from "../../../assets/Icons/bill.png";
import travelIcon from "../../../assets/Icons/travel-location.png";
import renovationIcon from "../../../assets/Icons/home-renovation.png";
import educationIcon from "../../../assets/Icons/education.png";
import loanImg from "../../../assets/illustrations/loanAgainstSecuritiesIllustration.svg";

import {cardsData} from "../../../data.js";



const LoanAgainstSecurities = () => {
    return (
        <div id='loan-against-securities' className='loan_against_securities-container '>
            <div className="loan-hero-section section__padding">
                <div className='loan-title'>
                    <h1 className='primary-heading'>Loan Against <span className='section-heading-focus'>Securities</span></h1>
                </div>
                <div className='loan_against_securities-main'>

                    <div className="loan_against_securities-heading">


                        <div className='anupaat_whyanupaat-heading-explanation' data-aos="zoom-in-right" data-aos-duration="1000">
                            <div className='whyanupaat-subheading '>
                                <h2 className='secondary-heading'>Be a part of the next investment wave</h2>
                            </div>
                            <div className='loan_against_securities-description'>
                                <p>Loan Against Securities is a secured loan that allows you to raise instant liquidity against your investment as collateral. You will continue to retain ownership of the equity and all the benefits with them.


                                </p></div>
                            <div className='loan_against_securities-btn'>
                                <a href='/contact' className='btn'>Contact Us</a>

                            </div>
                        </div>
                    </div>
                    <div className='loan_against_securities-image' data-aos="zoom-in-left" data-aos-duration="1000">
                        <picture>
                            <img src={loanImg} alt=" " />

                        </picture>
                    </div>
                </div>
            </div>

            <div className="loan_against_securities__card-container">
                <div className='loan-card-title'>
                    <h1>Loan Against Securities</h1>
                    <p className="lead">Protect your investments from unplanned short-term expenses</p>
                </div>


                <div className='loan_against_securities-Card-container'>
                    <Card className="medical-card" >
                        <div className='card-body'>


                            <div className='card-img'> <img src={medicalIcon} alt="MedicalBillIcon" /></div>
                            <h3>Medical Expense</h3>


                        </div>

                    </Card>
                    <Card className="travel-card" >
                        <div className="card-body">

                            <div className='card-img'> <img src={travelIcon} alt="TravelBillIcon" /></div>

                            <h3>Travel Expense</h3>
                        </div>

                    </Card>
                    <Card className="renovation-card" >
                        <div className="card-body">


                            <div className='card-img'> <img src={renovationIcon} alt="RenovationBillIcon" /></div>
                            <h3>Renovation Expense</h3>


                        </div>
                    </Card>
                    <Card className="education-card" >
                        <div className="card-body">

                            <div className='card-img'> <img src={educationIcon} alt="EducationBillIcon" /></div>
                            <h3>Education Expense</h3>


                        </div>
                    </Card>
                </div>

               

            </div>

            <div className="loanAgainstSecuritiesFeaturesCardContainer section__padding">

                 
                {
                    cardsData.map(({ icon, title, description }, id) => {
                        return (
                            <Card className="loanAgainstSecuritiesFeaturesCard" key={id} data-aos="fade-up"
                                data-aos-anchor-placement="top-bottom" data-aos-duration="1000">
                                <img src={icon} alt="icon" className='card-icon' />

                                <div className='card-content'>
                                    <h3 className='why-block-heading'>{title}</h3>
                                    <small>{description}</small>
                                </div>
                            </Card>
                        )
                    })
                }
                </div>

        </div>
    )
}

export default LoanAgainstSecurities