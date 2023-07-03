import React from 'react'
import './loanagainstsecurities.css'
import Card from 'react-bootstrap/Card';
import medicalIcon from "../../../assets/Icons/bill.png";
import travelIcon  from "../../../assets/Icons/travel-location.png";
import renovationIcon  from "../../../assets/Icons/home-renovation.png";
import educationIcon  from "../../../assets/Icons/education.png";



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
                                <p>As our economy grows, participation in the stock markets is growing significantly.
                                    Anupaat Nivesh Address the growing need to access the stock market by
                                    offering unique baskets of Indian stocks managed by expert fund managers.
                                    Do more, be more.
                                </p></div>
                            <div className='loan_against_securities-btn'>
                                <a href='/contact' className='btn'>Contact Us</a>

                            </div>
                        </div>
                    </div>
                    <div className='loan_against_securities-image' data-aos="zoom-in-left" data-aos-duration="1000">
                        <picture>
                            <img src="" alt=" " />

                        </picture>
                    </div>
                </div>
            </div>

            <div className="loan_against_securities__card-container">
                <div className='loan-card-title'>
                    <h1>Unlock Value for your business</h1>
                    <p className="lead">Protect your investments from unplanned short-term expenses</p>
                </div>


                <div className='loan_against_securities-Card-container'>
                    <Card className="medical-card" >
                        <div className='card-body'>

                           
                            <div className='card-img'> <img src={medicalIcon} alt="MedicalBillIcon" /></div>
                            <h3>Medical Expense</h3>
                            <p></p>
                            
                        </div>

                    </Card>
                    <Card className="travel-card" >
                        <div className="card-body">

                            <div className='card-img'> <img src={travelIcon} alt="TravelBillIcon" /></div>
                            
                            <h3>Travel Expense</h3>
                            <p></p></div>
                        
                    </Card>
                    <Card className="renovation-card" >
                        <div className="card-body">

                           
                            <div className='card-img'> <img src={renovationIcon} alt="RenovationBillIcon" /></div>
                            <h3>Renovation Expense</h3>
                            <p></p>
                            
                        </div>
                    </Card>
                    <Card className="education-card" >
                        <div className="card-body">
                            
                            <div className='card-img'> <img src={educationIcon} alt="EducationBillIcon" /></div>
                            <h3>Education Expense</h3>
                            <p></p>
                            
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}

export default LoanAgainstSecurities