import React from 'react'
import './home.css';
import { Carousel } from './Carousel';

import {Testimonials} from '../testimonials/Testimonials';
import Whyanupaat from '../whyanupaat/Whyanupaat';
import About from '../about/About';
import Contact from '../../components/contact/Contact';
import { OurApp } from '../../components';



const Home = () => {
    return (
        <>
            <div className='anupaat_home'>
                <div className="home-section hero-section" id="home">
                    <Carousel />
                </div>

                <div className='home-section about-section'> <About /></div>
                <div className='home-section why-section'><Whyanupaat /></div>
                <div className='home-section testimonials-section'><Testimonials /></div>
                <div className='home-section offerings-section'>   <offerings /></div>
                <div className='home-section contact-section'><Contact /></div>
                <div className='home-section our-app-section'><OurApp /></div>
                





            </div>



        </>
    )
}

export default Home