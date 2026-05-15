
// Import Swiper React components
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./testimonials.css";


// import required modules

import { Autoplay, EffectCoverflow, Pagination, Navigation } from "swiper";
import { testimonials } from '../../data';




export const Testimonials = () => {

    return (
        <section className="testimonials" id="testimonials">
            <div className="testimonials__container">
                <div className="testimonial_title ">

                    <h1><span className='section-heading-focus'>Testimonials</span> </h1>


                </div>
                <div className=" testimonial-card ">
                    <Swiper
                        effect={"coverflow"}
                        slidesPerView={"auto"}
                        loop={false}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        centeredSlides={true}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2,
                            slideShadows: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={false}
                        grabCursor={true}
                        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                        className="mySwiper"
                    >
                        {
                            testimonials.map(({ name, id, avatar, quote, job }) => {
                                return (
                                    <SwiperSlide className="myswiper-slide" key={id}>
                                        <div className="testimonial-content">
                                            <div className="testimonial-heading">
                                                <h2 className="name">{name} </h2>
                                                <small className="job">{job}</small>
                                            </div>

                                            <div className="testimonial_avatar">
                                                <img src={avatar} alt={name} />
                                            </div>



                                            <div className="testimonial_text-section">


                                                <p className="testimonial-text"><q>{quote}</q></p>


                                            </div>
                                        </div>
                                    </SwiperSlide>

                                )
                            })

                        }


                    </Swiper>
                </div>
            </div>
        </section>
    )
}
export default Testimonials


