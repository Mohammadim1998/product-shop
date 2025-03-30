"use client";
import { useState, useEffect } from "react";
import AllCategories from "./AllCategories";
import NewCategories from "./NewCategories";
import CategoryDetails from "./CategoryDetails";

const CategoryMain = () => {
   const [midBanDetCtrl, setmidBanDetCtrl] = useState<string>("");
   const [randNumForBannerClick, setrandNumForBannerClick] = useState<number | null>(null);
   const [det, setdet] = useState(<AllCategories setrandNumForBannerClick={setrandNumForBannerClick} setmidBanDetCtrl={setmidBanDetCtrl} />);

   useEffect(() => {
      if (midBanDetCtrl != "") {
         setdet(<CategoryDetails midBanId={midBanDetCtrl} />);
      }
   }, [randNumForBannerClick]);

   return (
      <div className=" flex flex-col gap-8">
         <section className=" flex justify-between items-center gap-2">
            <h1 className=" text-blue-500 text-lg">دسته های محصول</h1>
            <div className=" flex justify-end items-center gap-2">
               <button
                  onClick={() =>
                     setdet(
                        <AllCategories setrandNumForBannerClick={setrandNumForBannerClick} setmidBanDetCtrl={setmidBanDetCtrl} />
                     )
                  }
                  className="flex justify-center items-center w-32 h-10 rounded-md bg-indigo-600 text-white transition-all duration-500' hover:bg-orange-500"
               >
                  همه
               </button>
               <button
                  onClick={() => setdet(<NewCategories />)}
                  className="flex justify-center items-center w-32 h-10 rounded-md bg-indigo-600 text-white transition-all duration-500' hover:bg-orange-500"
               >
                  دسته جدید
               </button>
            </div>
         </section>
         <section>{det}</section>
      </div>
   );
};

export default CategoryMain;