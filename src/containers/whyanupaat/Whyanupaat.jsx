import React from 'react';
import './whyanupaat.css';
import Card from 'react-bootstrap/Card';

import { whyanupaatData } from '../../data';
import whyAnupaatImg from '../../assets/illustrations/whyAnupaatIllustration.webp';
import preWhyAnupaatImg from '../../assets/illustrations/pre-whyAnupaatIllustration.webp';
import FeatureCard from '../../UiComponents/FeatureCard/FeatureCard';

const Whyanupaat = () => {
    return (
        <div className="anupaat__whyanupaat section__padding section__margin" id="whyanupaat">
            <div className='why-heading-section'>
                <h1 className='primary-heading why-heading'>Why <span className='section-heading-focus'>Anupaat Nivesh?</span></h1>
            </div>
            <div className='anupaat__whyanupaat-main'>

                <div className="anupaat__whyanupaat-heading">


                    <div className='anupaat_whyanupaat-heading-explanation' data-aos="zoom-in-right" data-aos-duration="1000">
                        <div className='whyanupaat-subheading '>
                            <h2 className='secondary-heading'>Your Trusted Partner in Wealth Creation</h2>
                        </div>

                        <div><p className='why-description'>Comprehensive investment solutions for every investor</p></div>

                        <div className='why-description2'><p>From mutual funds to direct equity investments, we offer a complete suite of products designed to match your financial goals and risk tolerance. Our expert advisors help you navigate the investment landscape with confidence.
                        </p></div>
                    </div>
                </div>
                <div className='whyanupaat-title-image' data-aos="zoom-in-left" data-aos-duration="1000">
                    <picture>
                        <source srcSet={whyAnupaatImg} type='image/webp' />
                        <source srcSet={preWhyAnupaatImg} type='image/webp' />
                        <img src={whyAnupaatImg} alt="questionimage" />
                    </picture>
                </div>
            </div>
            <div className="anupaat__card-container">
                {
                    whyanupaatData.map(({ icon, title, text }, id) => {
                        return (
                            <FeatureCard key={id} heading={title} icon={icon} description={text} id={id} />
                        )
                    })
                }




            </div>



        </div>
    )
}

export default Whyanupaat