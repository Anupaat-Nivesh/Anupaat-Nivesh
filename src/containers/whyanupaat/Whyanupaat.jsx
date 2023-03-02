import React from 'react';
import titleimg from '../../assets/whyanupaat-titleimage.jpg';
import './whyanupaat.css';
const Whyanupaat = () => {
    return (
        <div className="anupaat__whyanupaat section__margin" id="wanupaat">
            <div className='anupaat__whyanupaat-main'>

                <div className="anupaat__whyanupaat-heading">
                    <h1> WhyAnupaat Nivesh?</h1>

                    <div className='anupaat_whyanupaat-heading-explanation'>
                        <div className='whyanupaat-subheading'>
                            <h2>Experience An Enhanced Online Investment Platform</h2>
                        </div>
                        <p>Welcome to the town of investment! From Mutual Funds to Corporate Deposits,
                            we hold a lot in store, to suit the goals and needs of every investor and every
                            risk appetite.
                        </p>
                    </div>
                </div>
                <div className='whyanupaat-title-image'>
                    <img src={titleimg} />
                </div>
            </div>


        </div>
    )
}

export default Whyanupaat