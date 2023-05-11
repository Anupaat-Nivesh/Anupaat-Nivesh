import React, { useState } from 'react'
import './mutualfund.css';
import ContactModal from '../../../components/contact/contactModal/ContactModal';
import Card from 'react-bootstrap/Card';
import { mutualFundData } from '../../../data';
import {
    Chart, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';



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
                    boxWidth: 15,
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

                    <div className='anupaat_whyanupaat-heading-explanation' data-aos="zoom-in-right" data-aos-duration="1000">
                        <div className='whyanupaat-subheading '>
                            <h2 className='secondary-heading'>sub heading</h2>
                        </div>
                        <div className='mutual-funds-description'>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis fugit cum neque minima, incidunt omnis vel eius mollitia eligendi alias rem beatae molestias atque asperiores, sunt explicabo. Suscipit, quibusdam quaerat!
                            </p></div>
                        <div className='mutual-funds-btn'>
                            <a href='/contact' className='btn'>Contact Us</a>

                        </div>
                    </div>

                </div>
                <div className='mutual-funds-title-image' data-aos="zoom-in-left" data-aos-duration="1000">
                    <picture>
                        <img src="" alt="" />

                    </picture>
                </div>
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
                                        <div className="footer">
                                            <p className='tag'>Excited to invest in this Basket</p>
                                            <button data-fund-type={title} type="button" className='btn' onClick={(e) => {
                                                setModal(true);
                                                setFundType(e.target.dataset.fundType);
                                            }}>Contact Us</button>

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