"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "./Box";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const AllProducts = ({ setmidBanDetCtrl, setrandNumForBannerClick }) => {
   const goTopCtrl = () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   };
   const [auth_cookie, setAuth_cookie] = useState(Cookies.get("auth_cookie"));

   const [products, setproducts] = useState([-1]);
   const [numbersOfBtns, setnumbersOfBtns] = useState([-1]);
   const [filteredBtns, setfilteredBtns] = useState([-1]);
   const [pageNumber, setpageNumber] = useState(1);
   const [allProductNumber, setallProductNumber] = useState(0);
   const paginate = 10;
   const [categoryUrl, setcategoryUrl] = useState("products");

   useEffect(() => {
      axios
         .get(`https://file-server.liara.run/api/${categoryUrl}?pn=${pageNumber}&&pgn=${paginate}`,{ headers: { auth_cookie: auth_cookie }})
         .then((d) => {
            setproducts(d.data.GoalProducts);
            setnumbersOfBtns(
               Array.from(
                  Array(Math.ceil(d.data.AllProductsNum / paginate)).keys()
               )
            );
            setallProductNumber(d.data.AllProductsNum);
         })
         .catch((e) => {
            toast.error("خطا در لود اطلاعات", {
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
            });
            console.log(e);
         });
   }, [pageNumber, categoryUrl]);

   useEffect(() => {
      if (numbersOfBtns[0] != -1 && numbersOfBtns.length > 0) {
         const arr = [];
         numbersOfBtns.map((n) => {
            if (
               n == 0 ||
               (n < pageNumber + 1 && n > pageNumber - 3) ||
               n == numbersOfBtns.length - 1
            ) {
               arr.push(n);
            }
         });
         setfilteredBtns(arr);
      }
      else if (numbersOfBtns.length == 0) {
         setfilteredBtns([]);
      }
   }, [numbersOfBtns]);

   return (
      <div className=" flex flex-col gap-8">
         <div className=" flex justify-end gap-2">

            <div className="text-xs text-black flex justify-end items-center gap-4">
               <button onClick={() => {
                  categoryUrl == "products"
                     ? console.log("")
                     : setproducts([-1]);
                  setcategoryUrl("products");
                  setpageNumber(1);
               }}
                  className={
                     categoryUrl == "products"
                        ? "bg-orange-400 p-2 rounded border-2 border-black"
                        : "bg-yellow-400 p-2 rounded border-2 border-black"}>همه دسته ها</button>

               <button onClick={() => {
                  categoryUrl == "get-products-of-type/book"
                     ? console.log("")
                     : setproducts([-1]);
                  setcategoryUrl("get-products-of-type/book");
                  setpageNumber(1);
               }}
                  className={
                     categoryUrl == "get-products-of-type/book"
                        ? "bg-orange-400 p-2 rounded border-2 cborder-black"
                        : "bg-yellow-400 p-2 rounded border-2 border-black"}>کتاب ها</button>

               <button onClick={() => {
                  categoryUrl == "get-products-of-type/app"
                     ? console.log("")
                     : setproducts([-1]);
                  setcategoryUrl("get-products-of-type/app");
                  setpageNumber(1);
               }}
                  className={
                     categoryUrl == "get-products-of-type/app"
                        ? "bg-orange-400 p-2 rounded border-2 border-black"
                        : "bg-yellow-400 p-2 rounded border-2 border-black"}>اپ ها</button>

               <button onClick={() => {
                  categoryUrl == "get-products-of-type/gr"
                     ? console.log("")
                     : setproducts([-1]);
                  setcategoryUrl("get-products-of-type/gr");
                  setpageNumber(1);
               }}
                  className={
                     categoryUrl == "get-products-of-type/gr"
                        ? "bg-orange-400 p-2 rounded border-2 border-black"
                        : "bg-yellow-400 p-2 rounded border-2 border-black"}>فایل های گرافیکی</button>
            </div>

            <div className=" w-32 h-10 rounded bg-indigo-500 flex justify-center items-center text-white">
               {allProductNumber} محصول
            </div>

         </div>
         <div className=" flex flex-col gap-6">
            {products[0] == -1 ? (
               <div className=" flex justify-center items-center p-12">
                  <Image
                     alt="loading"
                     width={120}
                     height={120}
                     src={"/loading.svg"}
                  />
               </div>
            ) : products.length < 1 ? (
               <div className=" flex justify-center items-center w-full p-8">
                  محصولی موجود نیست...
               </div>
            ) : (
               products.map((da, i) => (
                  <Box
                     setrandNumForBannerClick={setrandNumForBannerClick}
                     setmidBanDetCtrl={setmidBanDetCtrl}
                     key={i}
                     data={da}
                  />
               ))
            )}
         </div>
         <div className=" flex justify-center gap-4 items-center">
            {filteredBtns[0] == -1 ? (
               <div className=" flex justify-center items-center p-12">
                  <Image
                     alt="loading"
                     width={40}
                     height={40}
                     src={"/loading.svg"}
                  />
               </div>
            ) : (
               filteredBtns.map((da, i) => (
                  <button className={
                     da + 1 == pageNumber
                        ? " bg-orange-400 text-white w-8 h-8 flex justify-center items-center rounded transition-all duration-500 hover:bg-orange-500"
                        : " bg-indigo-500 text-white w-8 h-8 flex justify-center items-center rounded transition-all duration-500 hover:bg-orange-500"
                  } onClick={() => {
                     da + 1 == pageNumber
                        ? console.log("")
                        : setproducts([-1]);
                     setpageNumber(da + 1);
                     goTopCtrl();
                  }}
                     key={i}
                  >
                     {da + 1}
                  </button>
               ))
            )}
         </div>
         <ToastContainer
            bodyClassName={() => "font-[shabnam] text-sm flex items-center"}
            position="top-right"
            autoClose={3000}
            theme="colored"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
         />
      </div>
   );
};

export default AllProducts;
