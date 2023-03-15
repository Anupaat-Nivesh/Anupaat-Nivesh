
// Import Swiper React components
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

                    <h1 className="primary-heading">Testimonials</h1>

                </div>
                <div className=" testimonial-card ">
                    <Swiper
                        effect={"coverflow"}
                        loop={true}

                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}

                        centeredSlides={true}


                        slidesPerView={"auto"}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 150,
                            modifier: 2.5,
                            slideShadows: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {
                            testimonials.map(({ name, id, avatar, quote, job }) => {
                                return (
                                    <SwiperSlide key={id}>
                                        <div className="testimonial-content">
                                            <div className="testimonial-heading">
                                                <h2 className="name">{name} </h2>
                                                <small className="job">{job}</small>
                                            </div>

                                            <div className="testimonial_avatar">
                                                <img src={avatar} alt={name} />
                                            </div>



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





