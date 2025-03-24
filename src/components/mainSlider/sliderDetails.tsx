"use client";
import Image from "next/image";
// import "animate.css";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore, {
//     Navigation,
//     Pagination,
//     Scrollbar,
//     Autoplay,
// } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/autoplay";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";
// SwiperCore.use([Autoplay]);

type SliderItem = {
    _id: string;
    image: string;
    imageAlt: string;
    link: string;
}

type SliderPropsTypes = {
    data: SliderItem[]
}

const SliderDetails: React.FC<SliderPropsTypes> = ({ data }) => {
    const [nowSlide, setnowSlide] = useState(0);
    const sliderChangingHandler = (inp: number) => {
        let newNumber = nowSlide + inp;
        if (newNumber > data.length - 1) {
            newNumber = 0;
        }
        if (newNumber < 0) {
            newNumber = data.length - 1;
        }
        setnowSlide(newNumber);
    };
    const [slideHandler, setslideHandler] = useState(1);

    // useEffect(() => {
    //     let i = 1;
    //     if (i > data.length - 1) {
    //         i = 1;
    //     }else {
    //         i++;
    //     }

    //     setInterval(() => {
    //         sliderChangingHandler(i)
    //     }, 1000);
    // }, []);

    return (
        <>
            {
                !data.length
                    ? (<div></div>)
                    : (
                        <section className="z-20 container w-full mx-auto flex flex-col gap-0 md:gap-8 relative">
                            <div className="btns z-30 flex justify-end gap-1">
                                <FaChevronRight
                                    onClick={() => {
                                        setslideHandler(0);
                                        setTimeout(() => {
                                            sliderChangingHandler(-1);
                                            setslideHandler(1);
                                        }, 100);
                                    }}
                                    className="bg-white w-8 h-8 md:w-10 md:h-10 p-2 rounded border-zinc-800 border-[.2rem] cursor-pointer hover:border-zinc-500 transition-all duration-500"
                                />

                                <FaChevronLeft
                                    onClick={() => {
                                        setslideHandler(0);
                                        setTimeout(() => {
                                            sliderChangingHandler(1);
                                            setslideHandler(1);
                                        }, 100);
                                    }}
                                    className="bg-white w-8 h-8 md:w-10 md:h-10 p-2 rounded border-zinc-800 border-[.2rem] cursor-pointer hover:border-zinc-500 transition-all duration-500"
                                />
                            </div>
                            <div className="mt-4 md:mt-0 z-20 flex justify-center items-center transition-all duration-700">
                                <Image
                                    width={1280}
                                    height={250}
                                    className={
                                        slideHandler == 1
                                            ? "rounded-xl animate__animated  animate__bounceIn animate__slow"
                                            : "rounded-xl animate__animated  animate__bounceOut animate__slow"
                                    }
                                    alt={data[nowSlide].imageAlt}
                                    src={data[nowSlide].image}
                                />
                            </div>
                        </section>
                    )}
        </>
    );
};

export default SliderDetails;