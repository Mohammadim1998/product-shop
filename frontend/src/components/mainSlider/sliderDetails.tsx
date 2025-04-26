"use client";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Link from "next/link";

type SliderItem = {
    _id: string;
    image: string;
    imageAlt: string;
    link: string;
}

type SliderPropsTypes = {
    data: SliderItem[];
}

const SliderDetails: React.FC<SliderPropsTypes> = ({ data }) => {
    const swiperRef = useRef<any>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handlePrev = () => {
        if (swiperRef.current && !isBeginning) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const handleNext = () => {
        if (swiperRef.current && !isEnd) {
            swiperRef.current.swiper.slideNext();
        }
    };

    return (
        <div>
            {!data.length
                ? (<div></div>)
                : (
                    <section className="relative w-full h-full mx-auto mt-4 md:mt-22">
                        <Swiper
                            ref={swiperRef}
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            onSlideChange={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                            }}
                            onSwiper={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                            }}
                            className="w-full h-full"
                        >
                            {data?.map((item) => (
                                // <SwiperSlide key={item._id} className="relative h-64 md:h-96">
                                <SwiperSlide key={item._id} className="relative h-96">
                                    {/* <Link href={item.link} target="_blank" rel="noopener noreferrer"> */}
                                    <Image
                                        src={item.image}
                                        alt={item.imageAlt}
                                        quality={100}
                                        priority
                                        width={1951}
                                        height={250}
                                    />
                                    {/* </Link> */}
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <button
                            onClick={handlePrev}
                            disabled={isBeginning}
                            className={`absolute left-4 -top-14 z-10 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all ${isBeginning ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label="Previous slide"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isEnd}
                            className={`absolute left-16 -top-14 z-10 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all ${isEnd ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label="Next slide"
                        >
                            <FaChevronRight size={24} />
                        </button>
                    </section>
                )}
        </div>
    );
};

export default SliderDetails;