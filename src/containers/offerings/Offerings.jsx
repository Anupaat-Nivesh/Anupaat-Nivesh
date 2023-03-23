import React from 'react'
import img1 from '../../assets/illustrations/finance-01.png';
import './offerings.css';

export const Offerings = () => {
    return (
        <div id='offerings' className='offerings-container section__padding'>
            <div className='offerings-title'>
                <h1>Offerings</h1>
                <p className='lead'>Confused, Where you should start with your investment.?<br /> We have a wide range of products to start your investment journey. </p>

            </div>

            <article className='offerings__article'>
                <div className='offerings-img' data-aos="fade-right"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine">
                    <img src={img1} alt="Mutual Fund Basket" />
                </div>
                <div className='offerings__content' data-aos="fade-left">
                    <h2 className='offering_article-title'>Mutual Fund Basket</h2>
                    <p>
                        Choose & invest from a range of expert curated baskets of quality mutual funds to achieve your financial goals in a stipulated time period and based on your risk taking ability.
                        Child’s education, retirement, saving tax or creating wealth, there is a basket of quality mutual funds for all your financial goal planning needs and requirements.
                    </p>
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
                    <p>
                        Invest in iBaskets to achieve your financial goals.
                        Equity Baskets are created and managed by Registered Investment Advisors (RIAs) who are SEBI-registered professionals.
                    </p>
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
                    <p>
                        Safeguard your investment by opting for quick capital against securities. Your units will remain yours,
                        and you’ll keep on earning from them during your tenure for an instant loan for low credit score.
                    </p>
                    <div className='offering-btn'>
                        <a href='#' className='btn '>Learn More</a>
                    </div>
                </div>



            </article>





        </div>




    )
}

export default Offerings