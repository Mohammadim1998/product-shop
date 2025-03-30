"use client";
import Image from "next/image";

const Box = ({ data, setMidBanDetCtrl, setRandomNumForBannerClick }) => {
    return (
        <div
            onClick={() => {
                setMidBanDetCtrl(data._id);
                setRandomNumForBannerClick(Math.ceil(Math.random() * 20))
            }}
            className="relative flex justify-start items-center gap-8 cursor-pointer p-6 w-full rounded-lg bg-zinc-100 border-2 border-zinc-200 transition-all duration-500 hover:border-orange-500">
            <div className="flex justify-start items-center">
                <Image className="rounded-lg"
                    src={data.image}
                    alt={data.imageAlt}
                    title={data.imageAlt}
                    width={400}
                    height={200}
                />
            </div>

            <div className="flex flex-col gap-4 h-40">
                <div className="">{data.title}</div>
                <div className="text-xs absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded">{data.updatedAt}</div>

                <div className="absolute bottom-3 left-3 flex justify-end items-center gap-2">
                    <div className="text-xs bg-orange-500 text-white w-24 h-6 rounded flex justify-center items-center">{data.pageView} بازدید</div>
                    {
                        data.published == true
                        ?<div className="text-xs bg-green-600 text-white px-3 py-1 rounded">منتشر شده</div>
                        :<div className="text-xs bg-orange-500 text-white px-3 py-1 rounded">پیشنویس</div>
                        }
                </div>
            </div>
        </div>
    );
}

export default Box;