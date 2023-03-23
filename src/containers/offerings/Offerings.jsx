import React from 'react'
import img1 from '../../assets/illustrations/finance-01.png';
import './offerings.css';

export const Offerings = () => {
    return (
        <div id='offerings' className='offerings-container section__padding'>
            <div className='offerings-title'>
                <h1>Offerings</h1>
                <p className='lead'>sub heading</p>
            </div>

            <article className='offerings__article'>
                <div className='offerings-img' data-aos="fade-right"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine">
                    <img src={img1} alt="Mutual Fund Basket" />
                </div>
                <div className='offerings__content' data-aos="fade-left">
                    <h2 className='offering_article-title'>Mutual Fund Basket</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                    <div className='offering-btn'>
                        <a href='#' className='btn '>Learn More</a>
                    </div>
                </div>

            </article>

            <article className='offerings__article'>
                <div className='offerings__content' data-aos="fade-right"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine">
                    <h2 className='offering_article-title'>Equity Basket</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                    <div className='offering-btn'>
                        <a href='#' className='btn '>Learn More</a>
                    </div>
                </div>
                <div className='offerings-img' data-aos="fade-left">
                    <img src={img1} alt="Mutual Fund Basket" />
                </div>
            </article>

            <article className='offerings__article'>
                <div className='offerings-img' data-aos="fade-right"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine">
                    <img src={img1} alt="Mutual Fund Basket" />
                </div>
                <div className='offerings__content' data-aos="fade-left">

                    <h2 className='offering_article-title'>Loan Against Securities</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                    <div className='offering-btn'>
                        <a href='#' className='btn '>Learn More</a>
                    </div>
                </div>



            </article>





        </div>




    )
}

export default Offerings