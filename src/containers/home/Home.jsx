import React from 'react'
import './home.css';
import { Carousel } from './Carousel';
import { Testimonials } from './testimonials/Testimonials';


const Home = () => {
    return (
        <>
            <div className="anupaat__header section__padding" id="home">
                <Carousel />
            </div>
            <div>
                <Testimonials />
            </div>

        </>
    )
}

export default Home