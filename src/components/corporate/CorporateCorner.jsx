import React from 'react'
import './corporate.css';
import { corporateData } from '../../data';


const CorporateCorner = () => {
    return (
        <div id='corporate' className='corporate-corner-container '>
            <div className='corporate-corner-main'>

                <div className="corporate-corner-heading">
                    <div className='anupaat_corporate-corner-heading-explanation' data-aos="zoom-in-right" data-aos-duration="1000">
                        <div className="topLine">Corporate corner</div>
                        <div className='corporate-corner-subheading '>
                            <h2 className='secondary-heading'>Financial Wellness is the<br /> Ideal Employee Benefit</h2>
                        </div>
                        <div className='corporate-corner-description'>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto cupiditate culpa tempore! Provident ab voluptas asperiores, optio quam, quidem cumque dolorum iusto accusamus aliquid consequatur maxime odit perferendis in. Commodi.
                            </p>
                        </div>
                        <div className='corporate-corner-btn'>
                            <a href='/contact' className='btn'>Schedule a Demo</a>

                        </div>
                    </div>
                </div>
                <div className='corporate-corner-title-image' data-aos="zoom-in-left" data-aos-duration="1000">
                    <picture>
                        <img src=" " alt="image" />
                    </picture>
                </div>
            </div>
            <div className="corporate-why-container">
                <div className="why-section">
                    <div className="why-title"><h2>Why Financial Literacy</h2></div>
                    <div className="why-line"></div>
                    <div className="why-reasons">
                        {
                            corporateData.map(({ icon, title, description }, id) => {
                                return (
                                    <div className="reason-section" key={id}>
                                        <div className="reason-title">
                                            <div className="corporate-icon"> {icon}</div>
                                            {title}
                                        </div>
                                        <p>{description}</p>
                                    </div>

                                )
                            }
                            )
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CorporateCorner