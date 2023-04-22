import React from 'react'
import './loanagainstsecurities.css'
import Card from 'react-bootstrap/Card';
import equity2 from '../../../assets/equity2.png';
import equity3 from '../../../assets/equity3.png';



const LoanAgainstSecurities = () => {
    return (
        <div id='loan-against-securities' className='loan_against_securities-container '>
            <div className="loan-hero-section section__padding">
                <div className='loan-title'>
                    <h1 >Loan Against <span className='section-heading-focus'>Securities</span></h1>
                </div>
                <p className='lead'>Don't sacrifice your long-term goals for short-term needs. Finance a wedding event house
                    renovation or any unplanned expense without selling your investments. With MAFS, get a limit
                    against your investments the same day for all your short to medium-term financial needs.
                </p>
                <div className='loan-btn'>
                    <a className='btn'>Know More</a>
                </div>
                <div>

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

                            <h3>Medical Expense</h3>
                            <p>xyz</p>
                            <div className='card-img'> <img src={equity2} alt="image" /></div>
                        </div>

                    </Card>
                    <Card className="travel-card" >
                        <div className="card-body">

                            <h3>Travel Expense</h3>
                            <p>xyz</p></div>
                        <div className='card-img'> <img src={equity2} alt="image" /></div>
                    </Card>
                    <Card className="renovation-card" >
                        <div className="card-body">

                            <h3>Renovation Expense</h3>
                            <p>xyz</p>
                            <div className='card-img'> <img src={equity3} alt="image" /></div>
                        </div>
                    </Card>
                    <Card className="education-card" >
                        <div className="card-body">
                            <h3>Education Expense</h3>
                            <p>xyz</p>
                            <div className='card-img'> <img src={equity3} alt="image" /></div>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}

export default LoanAgainstSecurities