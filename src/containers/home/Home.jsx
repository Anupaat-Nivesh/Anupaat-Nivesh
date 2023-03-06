import React from 'react'
import './home.css';
import { Carousel } from './Carousel';


const Home = () => {
    return (
        <>
            <div className="anupaat__header section__padding" id="home">
                <Carousel />
            </div>

        </>
    )
}

export default Home