import React from 'react'
import './partnerwithus.css';
import Card from 'react-bootstrap/Card';

import { partnerData } from '../../data';

const PartnerWithUs = () => {
    return (
        <div id='partner-with-us' className="partner-withUS-container">

            <div className='partner-withUS-main'>

                <div className="partner-withUS-heading">
                    <div className='anupaat_partner-withUS-heading-explanation' data-aos="zoom-in-right" data-aos-duration="1000">
                        <div className="topLine">Partner With Us</div>
                        <div className='partner-withUS-subheading '>
                            <h2 className='secondary-heading'>Join Partnership with Anupaat Nivesh</h2>
                        </div>
                        <div className='partner-withUS-description'>
                            <p>As our economy grows, participation in the stock markets is growing significantly.
                                Indian investors opened a record 1.4 crore new demat accounts in FY21,
                                compared to 0.5 crore in FY20. Address this growing need to access the stock market by
                                offering unique baskets of Indian stocks managed by expert fund managers executed seamlessly.
                                Do more, be more.
                            </p>
                        </div>
                        <div className='partner-withUS-btn'>
                            <a href='/contact' className='btn'>Become Partner</a>

                        </div>
                    </div>
                </div>
                <div className='partner-withUS-title-image' data-aos="zoom-in-left" data-aos-duration="1000">
                    <picture>
                        <img src=" " alt="image" />

                    </picture>
                </div>
            </div>

            <div className="partner-withUS__card-container">
                <div className='partner-withUS-title'>
                    <h1>Explore Our Solutions And Opportunities To Partner</h1>
                </div>
                <div className='partner-withUS-Card-container'>
                    {
                        partnerData.map(({ icon, title, description }, id) => {
                            return (
                                <Card className="partner-withUS_data" key={id}>
                                    <div className='card-img'> <img src={icon} alt="icon" /></div>
                                    <div className='card-text'>
                                        <h3>{title}</h3>
                                        <p>{description}</p>
                                    </div>

                                    <button className="card-button">More info</button>
                                </Card>
                            )
                        })
                    }

                </div>

            </div>
            <div className="subscribe-container">
                <h4>Request Early Access to Get Started</h4>
                <h1 className="gradient-text">Subscribe to our Newsletter !<br /> Wealth Compass</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, reiciendis. Repudiandae minima, saepe atque ipsam nemo ex praesentium obcaecati officiis distinctio sapiente. Veritatis, dolore voluptas maxime est dolorum ea perspiciatis.</p>
                <button className='card-button'>Subscribe</button>
            </div>

        </div>

    )
}

export default PartnerWithUs