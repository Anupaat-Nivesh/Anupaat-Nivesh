import React from 'react'
import './home.css';
import { Carousel } from './Carousel';
import { Testimonials } from './testimonials/Testimonials';
import Whyanupaat from '../whyanupaat/Whyanupaat';
import About from '../about/About';
import Contact from '../../components/contact/Contact';



const Home = () => {
    return (
        <>
            <div className='anupaat_home'>
                <div className="anupaat__header" id="home">
                    <Carousel />
                </div>
                <div className='home-section'> <About /></div>
                <div className='home-section'>   <Whyanupaat /></div>
                <Testimonials />
                <offerings />
                <div className='home-section'>   <offerings /></div>
                <div className='home-section'> <Contact /></div>
                





            </div>



        </>
    )
}

export default Home