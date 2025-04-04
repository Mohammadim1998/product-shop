"use client";
import BlogBox from "@/components/newBlog/blogBox";
import GraphicSliderBox from "@/components/graphicSlider/graphicSliderBox";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { ProductsPropsTypes } from "@/app/page";

type RelatedPostsPropsTypes = {
    typeOfModel: string;
    relPostsData: string[];
    title: string;
}

const RelatedPosts: React.FC<RelatedPostsPropsTypes> = ({ typeOfModel, title, relPostsData }) => {
    const carouselRef = useRef<HTMLDivElement>(null);

    const carouselSwitcher = (data: number) => {
        if (carouselRef.current) {
            const width = carouselRef.current.offsetWidth;
            carouselRef.current.scrollTo(carouselRef.current.scrollLeft + width * data, 0)
        }
    }

    const [relModelDataState, setrelModelDataState] = useState<ProductsPropsTypes[] | null>(null);
    const [relLoading, setRelLoading] = useState<boolean>(true);
    const sendingDataForRel = { goalIds: relPostsData }

    useEffect(() => {
        const url =
            typeOfModel == "post"
                ? "https://file-server.liara.run/api/get-related-posts"
                : "https://file-server.liara.run/api/get-related-products"
        axios.post(url, sendingDataForRel)
            .then(d => {
                setrelModelDataState(d.data);
            })
            .catch(e => {
                setRelLoading(false);
            })
            .finally(() => {
                setRelLoading(false);
            })
    }, [relPostsData])

    return (
        <div>
            <div className="container bg-zinc-100 mx-auto py-8 rounded">
                <div className="flex flex-col gap-4 px-2">
                    <header className="flex justify-between items-center">
                        <h2 className="text-xl">{title}</h2>
                        <div className="flex gap-1">
                            <div className="flex items-center gap-1 text-zinc-600">
                                <FaChevronRight onClick={() => { carouselSwitcher(1) }}
                                    className="cursor-pointer bg-indigo-500 transition-all text-white duration-300 hover:bg-orange-400 hover:text-white w-10 h-10 p-3 rounded-md" />
                                <FaChevronLeft onClick={() => { carouselSwitcher(-1) }}
                                    className="cursor-pointer bg-indigo-500 transition-all text-white duration-300 hover:bg-orange-400 hover:text-white w-10 h-10 p-3 rounded-md" />
                            </div>
                        </div>
                    </header>

                    <div ref={carouselRef} className="sliderContainer w-full max-w-5xl overflow-x-scroll px-2 md:px-4 mx-auto ">
                        <div className="flex justify-between items-center gap-4">
                            {relLoading ?
                                <div className="w-full flex justify-center items-center p-12">
                                    <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                                </div>
                                : (relModelDataState && relModelDataState?.length < 1)
                                    ? <div className="justify-center flex items-center p-4">.محتوای مرتبطی موجود نیست</div>
                                    : (
                                        typeOfModel == "post"
                                            ? relModelDataState && relModelDataState?.map((post) => (
                                                <BlogBox data={post} key={post._id} />
                                            ))

                                            : relModelDataState && relModelDataState?.map((product) => (
                                                // po.typeOfProduct == "gr" ?
                                                <GraphicSliderBox itemData={product} key={product._id} />
                                                // : <ProductSliderBox itemData={po} key={i} />
                                            ))
                                    )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RelatedPosts;