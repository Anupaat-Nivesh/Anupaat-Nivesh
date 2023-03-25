import React from 'react'
import './home.css';
import { Carousel } from './Carousel';
import { Testimonials } from '../testimonials/Testimonials';
import { SkillCounter } from '../skillCounter/SkillCounter';

import Whyanupaat from '../whyanupaat/Whyanupaat';
import About from '../about/About';
import Offerings from '../offerings/Offerings';
import Contact from '../../components/contact/Contact';
import { OurApp } from '../../components';







const Home = () => {



    const img1 = require('../../assets/ImpanelmentsImages/empanelment1.png')
    const img2 = require('../../assets/ImpanelmentsImages/empanelment2.png')
    const img3 = require('../../assets/ImpanelmentsImages/empanelment3.png')
    const img4 = require('../../assets/ImpanelmentsImages/empanelment4.png')
    const img5 = require('../../assets/ImpanelmentsImages/empanelment5.png')
    const img6 = require('../../assets/ImpanelmentsImages/empanelment6.png')
    return (
        <>

            <div className='anupaat_home' id="home">
                <div className="home-section hero-section" >
                    <Carousel />
                </div>

                <section className='home-section about-section'> <About /></section>
                <section className='home-section why-section'><Whyanupaat /></section>
                <SkillCounter />
                <section className='home-section testimonials-section'><Testimonials /></section>

                <section className='home-section offerings-section'>   <Offerings /></section>
                <section className='home-section contact-section'><Contact /></section>
                <section className='home-section our-app-section'><OurApp /></section>

                <section className="empanelment section__padding section__margin">
                    <div >
                        <h1>Our <span className='section-heading-focus'>Empanelments</span></h1>
                        <p className="lead">subheading</p></div>
                    <div className="empanelment_container">
                        <div data-aos="fade-up">

                            <img src={img1} alt='empanels' />
                            <img src={img2} alt='empanels' />
                            <img src={img3} alt='empanels' />
                            <img src={img4} alt='empanels' />
                            <img src={img5} alt='empanels' />
                            <img src={img6} alt='empanels' />


                        </div>
                    </div>
                </section>




            </div>



        </>
    )
}

export default Home