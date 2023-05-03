import React from 'react'
import './mutualfund.css';
import Card from 'react-bootstrap/Card';
import { mutualFundData } from '../../../data';
import {
    Chart, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';



Chart.register(ArcElement, Tooltip, Legend);

const MutualFund = () => {


    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
                fullSize: false,
                labels: {
                    boxWidth: 15,
                    align: 'start',
                }
            },
        }


    };

    return (
        <div id='mutual-funds' className='mutualfund-container section__padding'>
            <div className='mutualFund-title'>
                <h1 >Mutual<span className='section-heading-focus'>Funds</span></h1>
                <div className='lead'>Go after all that matters to you.</div>
            </div>
            <div className='mutualFund-wrapper section__padding section__margin'>
                <div className='mutualfund-Card-container'>
                    {
                        mutualFundData.map(({ icon, title, description, chart, hreturn, ihorizon, mode, lockin, riskprofile }, id) => {
                            return (
                                <Card className="mutualfund_data" key={id}>
                                    <div className="card-info">
                                        <div className='card-title'>
                                            <img src={icon} alt="icon" />
                                            <h3>{title}</h3>
                                        </div>
                                        <p>{description}</p>
                                        <div className="mutualcard-body">
                                            <div>
                                                <h3>Historical Return</h3>
                                                <p>{hreturn}</p>
                                            </div>
                                            <div>
                                                <h3>Investment Horizon</h3>
                                                <p>{ihorizon}</p>
                                            </div>
                                            <div>
                                                <h3>Investment Mode</h3>
                                                <p>{mode}</p>
                                            </div>
                                            <div>
                                                <h3>LOCK-IN</h3>
                                                <p>{lockin}</p>
                                            </div>


                                        </div>
                                        <div className='mutualFund-donut-container'>
                                            <Doughnut
                                                data={chart}
                                                options={options}>

                                            </Doughnut>
                                        </div>

                                        <small>*Risk Profile for this basket is considered <span className='risk-profile'>{riskprofile}</span></small>
                                        <div class="footer">
                                            <p className='tag'>Excited to invest in this Basket</p>
                                            <button type="button" className='btn'>Contact Us</button>

                                        </div>
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