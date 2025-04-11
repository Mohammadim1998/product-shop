"use client";
import Link from "next/link";
import SlideBox from "./productSliderBox";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useRef } from "react";
import { ProductsPropsTypes } from "@/app/page";

type ProductsSliderPropsTypes = {
    goalData: ProductsPropsTypes[]
    title: string;
    linkComp: string;
}

const ProductsSlider: React.FC<ProductsSliderPropsTypes> = ({ goalData, title, linkComp }) => {
    const carouselRef = useRef<HTMLDivElement>(null);

    const carouselSwitcher = (direction: number) => {
        if (carouselRef.current) {
            const width = carouselRef.current.offsetWidth;

            carouselRef.current.scrollTo(carouselRef.current.scrollLeft + width * direction, 0)
        }
    }

    return (
        <>{
            goalData.length < 1
                ? <div></div>
                : (
                    <div className="bg-indigo-500 mt-3">
                        <div className=" container mx-auto py-8">
                            <section className="flex flex-col gap-4 px-2">
                                <header className="flex justify-between items-center">
                                    <h2 className=" text-2xl border-r-white border-r-2 pr-1 text-white">{title}</h2>
                                    <div className="flex gap-1">
                                        <div className="flex items-center gap-1 text-zinc-600">
                                            <FaChevronRight onClick={() => { carouselSwitcher(1) }}
                                                className="cursor-pointer bg-zinc-200 transition-all duration-300 hover:bg-orange-400 hover:text-white w-10 h-10 p-3 rounded-md" />
                                            <FaChevronLeft onClick={() => { carouselSwitcher(-1) }}
                                                className="cursor-pointer bg-zinc-200 transition-all duration-300 hover:bg-orange-400 hover:text-white w-10 h-10 p-3 rounded-md" />
                                        </div>

                                        <Link href={`/shop?&orderBy=date&type=${linkComp}&maxP=1000000000&minP=0&pgn=12&pn=1`} className="text-white border-white border-2 bg-orange-500 px-4 py-2 rounded-md transition-all duration-500">مشاهده همه</Link>
                                    </div>

                                </header>

                                <div ref={carouselRef} className="sliderContainer w-full max-w-7xl overflow-x-scroll px-4 ">
                                    <div className="flex justify-between items-center gap-4">
                                        {
                                            goalData.map((da, i) => <SlideBox key={i} itemData={da} />)
                                        }
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                )}
        </>
    );
}

export default ProductsSlider;