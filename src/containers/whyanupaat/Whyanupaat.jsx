import React from 'react';
import titleimg from '../../assets/whyanupaat-titleimage.jpg';
import './whyanupaat.css';
import Card from 'react-bootstrap/Card';

import { whyanupaatData } from '../../data';

const Whyanupaat = () => {
    return (
        <div className="anupaat__whyanupaat section__padding" id="whyanupaat">
            <div className='why-heading-section'>
                <h1 className='primary-heading why-heading'> Why Anupaat Nivesh?</h1>
            </div>
            <div className='anupaat__whyanupaat-main'>

                <div className="anupaat__whyanupaat-heading">


                    <div className='anupaat_whyanupaat-heading-explanation'>
                        <div className='whyanupaat-subheading '>
                            <h3 className='secondary-heading'>Experience An Enhanced Online Investment Platform</h3>
                        </div>

                        <p className='section-description why-description'>Welcome to the town of investment! From Mutual Funds to Corporate Deposits,

                            we hold a lot in store, to suit the goals and needs of every investor and every
                            risk appetite.
                        </p>
                    </div>
                </div>
                <div className='whyanupaat-title-image'>
                    <img src={titleimg} alt="questionimage" />
                </div>
            </div>
            <div className="anupaat__card-container">
                {
                    whyanupaatData.map(({ icon, id, title, text }) => {
                        return (
                            <Card className="whyanupaat_data" key={id}>
                                <span className='icon'>{icon}</span>
                                <h4 className='why-block-heading'>{title}</h4>
                                <small>{text}</small>
                            </Card>
                        )
                    })
                }




            </div>



        </div>
    )
}

export default Whyanupaat