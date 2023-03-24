import React from 'react';
import './whyanupaat.css';
import Card from 'react-bootstrap/Card';

import { whyanupaatData } from '../../data';
import whyAnupaatImg from '../../assets/illustrations/whyAnupaatIllustration.png';

const Whyanupaat = () => {
    return (
        <div className="anupaat__whyanupaat section__padding section__margin" id="whyanupaat">
            <div className='why-heading-section'>
                <h1 className='primary-heading why-heading'>Why <span className='section-heading-focus'>Anupaat Nivesh?</span></h1>
            </div>
            <div className='anupaat__whyanupaat-main'>

                <div className="anupaat__whyanupaat-heading">


                    <div className='anupaat_whyanupaat-heading-explanation'>
                        <div className='whyanupaat-subheading '>
                            <h2 className='secondary-heading'>Experience An Enhanced Online Investment Platform</h2>
                        </div>

                        <div><p className='why-description'>Welcome to the town of investment! </p></div>

                        <div className='why-description2'><p>From Mutual Funds to Direct Equity,
                            we have a lot in store, to suit the goals and needs of every individual investor and every
                            risk appetite.
                        </p></div>
                    </div>
                </div>
                <div className='whyanupaat-title-image'>
                    <img src={whyAnupaatImg} alt="questionimage" />
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