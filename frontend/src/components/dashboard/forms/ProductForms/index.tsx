"use client";
import { useState, useEffect } from "react";
import AllProducts from "./allProducts";
import NewProduct from "./newProduct";
import ProductDetails from "./productDetails";

const ProductsMain = () => {
   const [midBanDetCtrl, setmidBanDetCtrl] = useState<string>("");
   const [randNumForBannerClick, setrandNumForBannerClick] = useState<number>(1);
   const [det, setdet] = useState(<AllProducts setrandNumForBannerClick={setrandNumForBannerClick} setmidBanDetCtrl={setmidBanDetCtrl} />);

   useEffect(() => {
      if (midBanDetCtrl != "") {
         setdet(<ProductDetails goalId={midBanDetCtrl} />);
      }
   }, [randNumForBannerClick]);

   return (
      <div className=" flex flex-col gap-8">
         <section className=" flex justify-between items-center gap-2">
            <h1 className=" text-blue-500 text-lg">محصولات</h1>
            <div className=" flex justify-end items-center gap-2">
               <button
                  onClick={() =>
                     setdet(
                        <AllProducts setrandNumForBannerClick={setrandNumForBannerClick} setmidBanDetCtrl={setmidBanDetCtrl} />
                     )
                  }
                  className=" flex justify-center items-center cursor-pointer w-32 h-10 rounded-md bg-indigo-600 text-white transition-all duration-500' hover:bg-orange-500"
               >
                  همه
               </button>
               <button
                  onClick={() => setdet(<NewProduct />)}
                  className=" flex justify-center items-center cursor-pointer w-32 h-10 rounded-md bg-indigo-600 text-white transition-all duration-500' hover:bg-orange-500"
               >
                  محصول جدید
               </button>
            </div>
         </section>
         <section>{det}</section>
      </div>
   );
};

export default ProductsMain;