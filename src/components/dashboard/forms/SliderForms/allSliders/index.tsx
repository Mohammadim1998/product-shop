"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "./Box";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

type SlidersPropsTypes = {
   setmidBanDetCtrl: (value: string) => void;
   setrandNumForBannerClick: (value: number) => void;
}

export type ItemSliderPropsTypes = {
   _id: string;
   date: string;
   image: string;
   imageAlt: string;
   situation: boolean;
   sorter: number;
   link?: string;
}

const Allsliders: React.FC<SlidersPropsTypes> = ({ setmidBanDetCtrl, setrandNumForBannerClick }) => {
   const goTopCtrl = () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   };

   const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
   const [sliders, setsliders] = useState<ItemSliderPropsTypes[] | null>(null);
   const [numbersOfBtns, setnumbersOfBtns] = useState<number[]>([-1]);
   const [filteredBtns, setfilteredBtns] = useState<number[]>([-1]);
   const [pageNumber, setpageNumber] = useState<number>(1);
   const [allSliderNumber, setallSliderNumber] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(true);
   const paginate = 3;

   useEffect(() => {
      const fetData = async () => {
         try {
            axios.get(`https://file-server.liara.run/api/sliders?pn=${pageNumber}&&pgn=${paginate}`, { headers: { auth_cookie: auth_cookie } })
               .then((d) => {
                  setsliders(d.data.GoalSliders);
                  setnumbersOfBtns(
                     Array.from(
                        Array(Math.ceil(d.data.AllSlidersNum / paginate)).keys()
                     )
                  );
                  setallSliderNumber(d.data.AllSlidersNum);
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
                  setLoading(false);
               })
               .finally(() => {
                  setLoading(false);
               })
         } catch (error) {
            console.log(error);
         }
      }

      fetData();
   }, [pageNumber]);

   useEffect(() => {
      if (numbersOfBtns[0] != -1 && numbersOfBtns.length > 0) {
         const arr: number[] = [];
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
         <div className=" flex justify-end">
            <div className=" w-32 h-10 rounded bg-indigo-500 flex justify-center items-center text-white">
               {allSliderNumber} اسلایدر
            </div>
         </div>
         <div className=" flex flex-col gap-6">
            {loading ? (
               <div className=" flex justify-center items-center p-12">
                  <Image
                     alt="loading"
                     width={120}
                     height={120}
                     src={"/loading.svg"}
                  />
               </div>
            ) : sliders && sliders?.length < 1 ? (
               <div className=" flex justify-center items-center w-full p-8">
                  اسلایدری موجود نیست...
               </div>
            ) : (
               sliders && sliders?.map((ba, i) => (
                  <Box
                     setrandNumForBannerClick={setrandNumForBannerClick}
                     setmidBanDetCtrl={setmidBanDetCtrl}
                     key={i}
                     data={ba}
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
               filteredBtns?.map((da, i) => (
                  <button className={
                     da + 1 == pageNumber
                        ? " bg-orange-400 text-white w-8 h-8 flex justify-center items-center rounded transition-all duration-500 hover:bg-orange-500"
                        : " bg-indigo-500 text-white w-8 h-8 flex justify-center items-center rounded transition-all duration-500 hover:bg-orange-500"
                  } onClick={() => {
                     da + 1 == pageNumber
                        ? console.log("")
                        : setsliders(null);
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

export default Allsliders;
