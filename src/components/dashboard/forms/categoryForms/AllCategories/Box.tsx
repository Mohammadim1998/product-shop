"use client";
import Image from "next/image";
import { ItemCategoryPropsTypes } from ".";

type BoxPropsTpes = {
   setmidBanDetCtrl: (value: string) => void;
   setrandNumForBannerClick: (value: number) => void;
   data: ItemCategoryPropsTypes
}

const Box: React.FC<BoxPropsTpes> = ({ data, setmidBanDetCtrl, setrandNumForBannerClick }) => {
   const goTopCtrl = () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   }

   return (
      <div
         onClick={() => {
            goTopCtrl();
            setmidBanDetCtrl(data._id);
            const rn = Math.random();
            setrandNumForBannerClick(rn);
         }}
         className=" relative flex justify-start  gap-8 items-center cursor-pointer p-6 w-full rounded-lg bg-zinc-100 border-2 border-zinc-200 transition-all duration-500 hover:border-orange-500"
      >
         <div className=" flex justify-start items-center ">
            <Image
               className=" rounded-lg"
               src={data.image}
               alt={data.imageAlt}
               title={data.imageAlt}
               width={100}
               height={100}
            />
         </div>
         <div className=" flex  flex-col gap-4  h-10">
            <div>
               {data.title}
            </div>
            <div className="absolute text-xs text-white bottom-3 left-3 flex justify-end items-center gap-2">
               <div className="bg-blue-600 px-3 py-1 rounded">{
                  data.typeOfProduct == "book"
                     ? <div>کتاب</div>
                     : (data.typeOfProduct == "app")
                        ? <div>اپلیکیشن</div>
                        : <div>فایل گرافیکی</div>
               }
               </div>
               <div>
                  {
                     data.situation == true
                        ? <div className=" text-xs bg-green-600 text-white px-3 py-1 rounded">منتشر شده</div>
                        : <div className=" text-xs bg-orange-500 text-white px-3 py-1 rounded">پیشنویس</div>
                  }
               </div>
            </div>
         </div>
      </div>
   );
};

export default Box;