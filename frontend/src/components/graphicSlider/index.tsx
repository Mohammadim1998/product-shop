"use client";
import Link from "next/link";
import GraphicSliderBox from "./graphicSliderBox";
import { useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import "../../components/custom.css";
import { ProductsPropsTypes } from "@/app/page";

type GraphicSliderPropsTypes = {
    goalData: ProductsPropsTypes[]
}

const GraphicSlider: React.FC<GraphicSliderPropsTypes> = ({ goalData }) => {
    const carouselRef = useRef<HTMLDivElement>(null);

    const carouselSwitcher = (direction: number) => {
        if (carouselRef.current) {
            const width = carouselRef.current.offsetWidth;

            carouselRef.current.scrollTo(carouselRef.current.scrollLeft + width * direction, 0)
        }
    }

    return (
        <>{
            goalData?.length < 1
                ? <div></div>
                : (
                    <section className="bg-[#ffc422] mt-4">
                        <div className=" container mx-auto py-8">
                            <div className="flex flex-col gap-4 px-2">
                                <header className="flex justify-between items-center">
                                    <h2 className="text-lg md:text-2xl border-r-black border-r-2 pr-1 text-black">فایل های گرافیکی</h2>
                                    <div className="flex gap-1">
                                        <div className="flex items-center gap-1 text-zinc-600">
                                            <FaChevronRight onClick={() => { carouselSwitcher(1) }}
                                                className="cursor-pointer bg-zinc-200 transition-all duration-300 hover:bg-indigo-400 hover:text-white w-10 h-10 p-3 rounded-md" />
                                            <FaChevronLeft onClick={() => { carouselSwitcher(-1) }}
                                                className="cursor-pointer bg-zinc-200 transition-all duration-300 hover:bg-indigo-400 hover:text-white w-10 h-10 p-3 rounded-md" />
                                        </div>

                                        <Link href={`/shop?&orderBy=date&type=gr&maxP=1000000000&minP=0&pgn=12&pn=1`} className="text-white border-white border-2 bg-indigo-500 px-4 py-2 rounded-md transition-all duration-500 hover:bg-indigo-600">همه</Link>
                                    </div>

                                </header>
                                <div ref={carouselRef} className="sliderContainer w-full max-w-7xl overflow-x-scroll px-4 ">
                                    <div className="flex justify-between items-center gap-4">
                                        {goalData?.map((da, i) => (
                                            <GraphicSliderBox key={i} itemData={da} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}</>
    )
}

export default GraphicSlider;