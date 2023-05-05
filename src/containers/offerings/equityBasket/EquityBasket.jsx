import React from 'react'
import './equitybasket.css'
import equityImg from '../../../assets/equity.png';
import Card from 'react-bootstrap/Card';
import { equityBasketData } from '../../../data';
const EquityBasket = () => {
    return (
        <div id='equity-basket' className='equitybasket-container section__padding'>
            <div className='equity-title'>
                <h1 className='primary-heading'>Equity <span className='section-heading-focus'>Baskets</span></h1>
            </div>
            <div className='equity-basket-main'>

                <div className="equity-basket-heading">


                    <div className='anupaat_whyanupaat-heading-explanation' data-aos="zoom-in-right" data-aos-duration="1000">
                        <div className='whyanupaat-subheading '>
                            <h2 className='secondary-heading'>Be a part of the next investment wave</h2>
                        </div>
                        <div className='equity-description'>
                            <p>As our economy grows, participation in the stock markets is growing significantly.
                                Anupaat Nivesh Address the growing need to access the stock market by
                                offering unique baskets of Indian stocks managed by expert fund managers.
                                Do more, be more.
                            </p></div>
                        <div className='equity-btn'>
                            <a href='/contact' className='btn'>Get in Touch</a>

                        </div>
                    </div>
                </div>
                <div className='equity-title-image' data-aos="zoom-in-left" data-aos-duration="1000">
                    <picture>
                        <img src={equityImg} alt="image" />

                    </picture>
                </div>
            </div>

            <div className="equityBasket__card-container">
                <div className='equitybasket-title'>
                    <h1>Unlock Value for your Portfolio</h1>
                </div>
                <div className='equityBasket-Card-container'>
                    {
                        equityBasketData.map(({ icon, title, description }, id) => {
                            return (
                                <Card className="equitybasket_data" key={id}>
                                    <div className='card-img'> <img src={icon} alt="icon" /></div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </Card>
                            )
                        })
                    }

                </div>

            </div>
        </div>
    )
}

export default EquityBasket