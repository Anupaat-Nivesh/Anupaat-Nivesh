
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "./testimonials.css";
import { ImQuotesLeft } from "react-icons/im";

// import required modules
import { EffectCoverflow, Pagination } from "swiper";
import { testimonials } from '../../../data';


export const Testimonials = () => {


    return (
        < section className="testimonials">
            <div className="testimonials__container">
                <div className="testimonial_title">
                    <ImQuotesLeft className='quotes' />
                    <h1>Testimonials</h1>

                </div>
                <div className=" testimonial-card section__padding">
                    <Swiper
                        effect={"coverflow"}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        slidesPerView={"auto"}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        pagination={true}
                        modules={[EffectCoverflow, Pagination]}
                        className="mySwiper"
                    >
                        {
                            testimonials.map(({ name, id, avatar, quote, job }) => {
                                return (
                                    <SwiperSlide key={id}>
                                        <div className="testimonial-content">
                                            <div className="testimonial_avatar">  <img src={avatar} alt={name} /></div>
                                            <h2 className="name">{name}</h2>
                                            <div className="testimonial__text">


                                                <p><q>{quote}</q></p>
                                                <small className="job">{job}</small>

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





