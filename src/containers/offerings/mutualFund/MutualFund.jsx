import React from 'react'
import './mutualfund.css';
import Card from 'react-bootstrap/Card';
import { mutualFundData } from '../../../data';


const MutualFund = () => {

    return (
        <div id='mutual-funds' className='mutualfund-container section__padding'>
            <div className='mutualFund-title'>
                <h1 >Mutual<span className='section-heading-focus'>Funds</span></h1>
                <div className='lead'>Go after all that matters to you.</div>
            </div>
            <div className='mutualFund-wrapper section__padding section__margin'>
                <div className='mutualfund-Card-container'>
                    {
                        mutualFundData.map(({ icon, title, description, chart }, id) => {
                            return (
                                <Card className="mutualfund_data" key={id}>
                                    <img src={icon} alt="icon" />
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                    <div className='mutualFund-donut-container'>
                                        <img src={chart} alt="icon" />

                                    </div>


                                </Card>
                            )
                        })
                    }

                </div>
            </div>


        </div >


    )
}

export default MutualFund