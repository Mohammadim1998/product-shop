"use client";
import { useRef, useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

const NewCategory = () => {
   const [auth_cookie, setAuth_cookie] = useState(Cookies.get("auth_cookie"));
   const titleRef = useRef<HTMLInputElement>(null);
   const slugRef = useRef<HTMLInputElement>(null);
   const imageUrlRef = useRef<HTMLInputElement>(null);
   const imageAltRef = useRef<HTMLInputElement>(null);
   const shortDescRef = useRef<HTMLInputElement>(null);
   const typeOfProductRef = useRef<HTMLSelectElement>(null);
   const situationRef = useRef<HTMLSelectElement>(null);

   const submiter = (e: React.FormEvent) => {
      e.preventDefault();

      // Null checks for refs
      if (!titleRef.current || !slugRef.current || !imageUrlRef.current ||
         !imageAltRef.current || !shortDescRef.current ||
         !situationRef.current || !typeOfProductRef.current) {
         toast.success("لطفا تمام فیلدها را پر کنید", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
         })
         return;
      }

      const formData = {
         title: titleRef.current.value,
         slug: slugRef.current.value,
         image: imageUrlRef.current.value,
         imageAlt: imageAltRef.current.value,
         situation: situationRef.current.value,
         shortDesc: shortDescRef.current.value,
         typeOfProduct: typeOfProductRef.current.value,
         date: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
         }),
      };
      const url = `https://file-server.liara.run/api/new-category`;
      axios
         .post(url, formData, { headers: { auth_cookie: auth_cookie } })
         .then((d) => {
            formData.situation == "true"
               ? toast.success(" دسته محصول با موفقیت منتشر شد.", {
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
               })
               : toast.success(" دسته محصول به صورت پیش نویس ذخیره شد.", {
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
               });
         })
         .catch((e) => {
            let message = "متاسفانه ناموفق بود.";
            if (e.response.data.msg) {
               message = e.response.data.msg;
            }
            toast.error(message, {
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
            });
         });
   };
   // FORM SHOULD BE NOT SEND WITH ENTER KEY
   const formKeyNotSuber = (event: React.KeyboardEvent) => {
      if (event.key == "Enter") {
         event.preventDefault();
      }
   };

   return (
      <div className=" flex flex-col gap-8">
         <h2 className=" text-orange-500">دسته جدید</h2>
         <form
            onSubmit={submiter}
            onKeyDown={formKeyNotSuber}
            className=" flex flex-col gap-6"
         >
            <div className=" flex flex-col gap-2">
               <div>عنوان دسته محصول </div>
               <input
                  required={true}
                  ref={titleRef}
                  type="text"
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               />
            </div>
            <div className=" flex flex-col gap-2">
               <div>اسلاگ دسته محصول</div>
               <input
                  required={true}
                  ref={slugRef}
                  type="text"
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               />
            </div>
            <div className=" flex flex-col gap-2">
               <div>آدرس عکس</div>
               <input
                  required={true}
                  ref={imageUrlRef}
                  type="text"
                  className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               />
            </div>
            <div className=" flex flex-col gap-2">
               <div>توضیحات کوتاه</div>
               <input
                  required={true}
                  ref={shortDescRef}
                  type="text"
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               />
            </div>
            <div className=" flex flex-col gap-2">
               <div>آلت عکس</div>
               <input
                  required={true}
                  ref={imageAltRef}
                  type="text"
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               />
            </div>
            <div className=" flex flex-col gap-2">
               <div>نوع دسته بندی محصول</div>
               <select
                  ref={typeOfProductRef}
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               >
                  <option value={"book"}>کتاب</option>
                  <option value={"app"}>اپلیکیشن</option>
                  <option value={"gr"}>فایل گرافیکی</option>
               </select>
            </div>
            <div className=" flex flex-col gap-2">
               <div>انتشار یا پیشنویس</div>
               <select
                  ref={situationRef}
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               >
                  <option value={"true"}>انتشار</option>
                  <option value={"false"}>پیشنویس</option>
               </select>
            </div>

            <button
               type="submit"
               className=" p-2 bg-indigo-600 text-white w-full rounded-md transition-all duration-500 hover:bg-orange-500"
            >
               ارسال
            </button>
         </form>
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

export default NewCategory;