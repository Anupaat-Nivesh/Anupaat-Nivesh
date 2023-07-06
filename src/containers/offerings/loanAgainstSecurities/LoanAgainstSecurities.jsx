import React from 'react'
import './loanagainstsecurities.css'
import Card from 'react-bootstrap/Card';
import loanImg from "../../../assets/illustrations/loanAgainstSecuritiesIllustration.svg";
import FeatureCard from '../../../UiComponents/FeatureCard/FeatureCard';

import { cardsData, expenseTypeCardsData } from "../../../data.js";




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


                    {
                        expenseTypeCardsData.map((obj, id) => {
                            return (
                                <Card className="expense-type-card" style={{ backgroundColor: obj.colorTheme }} key={id} >
                                    <div className='card-body'>


                                        <div className='card-img'> <img src={obj.icon} alt="MedicalBillIcon" /></div>
                                        <h3>{obj.name}</h3>


                                    </div>

                                </Card>
                            )
                        })
                    }

                </div>


            </div>

            <section className='loanAgainstSecuritiesFeatures section__padding'>
                    <h1>Features & Benefits of LAS</h1>
            

            <div className="loanAgainstSecuritiesFeaturesCardContainer ">


                {
                    cardsData.map(({ icon, title, description }, id) => {
                        return (
                            <FeatureCard heading={title} description={description} icon={icon} id={id} />
                        )
                    })
                }
            </div>
            </section>

        </div>
    )
}

export default LoanAgainstSecurities