import React from 'react'
import { ListGroupItem } from 'react-bootstrap';
import './about.css';
const About = () => {
    return (
        <div id='about' className='section__padding'>
            <h1>About AnupaatNivesh</h1>
            <p> Started in 2018, Anupaat Nivesh is providing one2one consulting to start with your investment journey. 
                Anupaat Nivesh aim to reach out to the common man and extend the opportunity to create wealth by providing them valuable and ethical financial advice. 
                Equity investing has always been an grey area for most of people. 
                However, historically there has been no better way to grow your money exponentially. </p>      
                <p>We at Anupaat Nivesh help our customers with true and quality advise about investment options which can be huge wealth creator to middle class.
</p>
                <p>How we help our customers:
                    <ListGroupItem>
                <li>By Assessing individual's requirements and goals</li>
                <li>By Creating awareness about financial freedom</li>
                <li>By Providing coaching to avoid financial issues related to Investment needs and TAX benefits</li>
                <li>By Providing platform for Investment in Equity MFs and our curated equity baskets</li>By Providing coaching to avoid financial issues related to Investment needs and TAX benefits
                <li>By Managing their investments for higher returns</li> 
                </ListGroupItem>
             </p>
        </div>
    )
}

export default About