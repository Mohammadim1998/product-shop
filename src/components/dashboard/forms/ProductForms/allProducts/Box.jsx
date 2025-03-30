"use client";
import Image from "next/image";
const Box = ({ data, setmidBanDetCtrl, setrandNumForBannerClick }) => {
   //PRICE BEAUTIFUL
   function priceChanger(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }

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
               width={400}
               height={200}
            />
         </div>
         <div className=" flex  flex-col gap-4  h-40">
            <div>{data.title} </div>
            <div className="absolute top-3 left-3 flex text-white justify-end items-center gap-2">
               <div className=" text-xs  bg-blue-500 text-white px-3 py-1 rounded">
                  {data.updatedAt}
               </div>
               <div className=" text-xs  bg-blue-500 text-white px-3 py-1 rounded">
                  {data.buyNumber} فروش
               </div>
               <div className=" text-xs  bg-blue-500 text-white px-3 py-1 rounded">
                  {priceChanger(data.price)} تومان
               </div>
            </div>

           

            <div className="absolute bottom-3 left-3 flex justify-end items-center gap-2">
            <div className=" text-xs  bg-blue-500 text-white px-3 py-1 rounded">
               {data.typeOfProduct == "book" ? (
                  <div>کتاب</div>
               ) : data.typeOfProduct == "app" ? (
                  <div>اپلیکیشن</div>
               ) : (<div>فایل گرافیکی</div>)
               }
            </div>
               <div className=" text-xs bg-orange-500 w-24 h-6 rounded flex justify-center items-center">
                  {data.pageView} بازدید
               </div>
               {
                  data.published == true
                     ? <div className=" text-xs bg-green-600 px-3 py-1 rounded">منتشر شده</div>
                     : <div className=" text-xs bg-orange-500 px-3 py-1 rounded">پیشنویس</div>
               }
            </div>
         </div>
      </div>
   );
};

export default Box;