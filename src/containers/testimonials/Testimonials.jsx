
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./testimonials.css";
import { ImQuotesLeft } from "react-icons/im";

// import required modules

import { EffectCoverflow, Pagination, Navigation } from "swiper";
import { testimonials } from '../../data';



export const Testimonials = () => {


    return (
        <section className="testimonials section__padding" id="testimonials">
            <div className="testimonials__container section__padding">
                <div className="testimonial_title ">
                    {/* <ImQuotesLeft className='quotes' /> */}
                    <h1 className="primary-heading">Testimonials</h1>

                </div>
                <div className=" testimonial-card ">
                    <Swiper
                        effect={"coverflow"}

                        centeredSlides={true}
                        rewind={true}
                        slidesPerView={"auto"}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 150,
                            modifier: 2.5,
                            slideShadows: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[EffectCoverflow, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {
                            testimonials.map(({ name, id, avatar, quote, job }) => {
                                return (
                                    <SwiperSlide key={id}>
                                        <div className="testimonial-content">
                                        
                                        <div className="testimonial_avatar">  <img src={avatar} alt={name} /></div>
                                        <h2 className="name">{name} <small className="job">{job}</small></h2>
                                            
                                            <div className="testimonial__text">


                                                <p><q>{quote}</q></p>
                                                

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





