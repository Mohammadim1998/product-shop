"use client";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

type DetailsCategoryPropsTypes = {
   // midBanId: (value: string) => void;
   midBanId: string;
}

type ItemsPropsTypes = {
   _id: string;
   title: string;
   date: string;
   slug: string;
   image: string;
   imageAlt: string;
   shortDesc: string;
   situation: boolean;
   typeOfProduct: string;
}

const CategoryDetails: React.FC<DetailsCategoryPropsTypes> = ({ midBanId }) => {
   // FORM SHOULD BE NOT SEND WITH ENTER KEY
   const formKeyNotSuber = (event: React.KeyboardEvent<HTMLFormElement>) => {
      if (event.key == "Enter") {
         event.preventDefault();
      }
   };
   const [auth_cookie, setAuth_cookie] = useState(Cookies.get("auth_cookie"));

   const titleRef = useRef<HTMLInputElement>(null);
   const slugRef = useRef<HTMLInputElement>(null);
   const imageUrlRef = useRef<HTMLInputElement>(null);
   const imageAltRef = useRef<HTMLInputElement>(null);
   const shortDescRef = useRef<HTMLInputElement>(null);
   const situationRef = useRef<HTMLSelectElement>(null);
   const typeOfProductRef = useRef<HTMLSelectElement>(null);

   const updater = (e: React.FormEvent) => {
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
         goalId: midBanId,
         title: titleRef.current.value,
         slug: slugRef.current.value,
         image: imageUrlRef.current.value,
         imageAlt: imageAltRef.current.value,
         shortDesc: shortDescRef.current.value,
         situation: situationRef.current.value,
         typeOfProduct: typeOfProductRef.current.value,

         date: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
         }),
      };
      const url = `https://file-server.liara.run/api/update-category/${midBanId}`;
      axios
         .post(url, formData, { headers: { auth_cookie: auth_cookie } })
         .then((d) => {
            formData.situation == "true"
               ? toast.success("دسته محصول با موفقیت منتشر شد", {
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
               })
               : toast.success("دسته محصول به صورت پیشفرض ذخیره شد", {
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
   const [fullData, setfullData] = useState<ItemsPropsTypes | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchData = async () => {
         await axios.get(
            `https://file-server.liara.run/api/get-category/${midBanId}`, { headers: { auth_cookie: auth_cookie } })
            .then((d) => {
               setfullData(d.data);
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
               setLoading(false);
            })
            .finally(() => {
               setLoading(false);
            })
      }

      fetchData();
   }, [midBanId]);

   const remover = () => {
      const url = `https://file-server.liara.run/api/delete-category/${midBanId}`;
      axios
         .post(url, { headers: { auth_cookie: auth_cookie } })
         .then((d) => {
            toast.success("دسته محصول با موفقیت حذف شد.", {
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

   return (
      <div className=" flex flex-col gap-8">
         {loading ? (
            <div className=" flex justify-center items-center p-12">
               <Image
                  alt="loading"
                  width={120}
                  height={120}
                  src={"/loading.svg"}
               />
            </div>
         ) : (
            <div className=" flex flex-col gap-8">
               <div className=" flex justify-between items-center">
                  <h2 className=" text-orange-500">جزئیات بنر</h2>
                  <button
                     onClick={() => remover()}
                     className=" bg-rose-600 text-white cursor-pointer px-4 py-1 rounded-md text-xs transition-all duration-500 hover:bg-rose-700"
                  >
                     حذف
                  </button>
               </div>
               <div className=" flex justify-between items-center">
                  <div className=" bg-zinc-100 rounded px-3 py-1 text-sm">
                     {fullData?._id ? fullData?._id : ""}
                  </div>
                  <div className=" bg-zinc-100 rounded px-3 py-1 text-sm">
                     {fullData?.date ? fullData?.date : ""}
                  </div>
               </div>
               <form
                  onKeyDown={formKeyNotSuber}
                  onSubmit={updater}
                  className=" flex flex-col gap-6"
               >
                  <div className=" flex flex-col gap-2">
                     <div>عنوان جدید دسته</div>
                     <input
                        required={true}
                        defaultValue={fullData?.title}
                        ref={titleRef}
                        type="text"
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>اسلاگ جدید دسته</div>
                     <input
                        required={true}
                        defaultValue={fullData?.slug}
                        ref={slugRef}
                        type="text"
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>آدرس جدید عکس</div>
                     <input
                        required={true}
                        defaultValue={fullData?.image}
                        ref={imageUrlRef}
                        type="text"
                        className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>آلت جدید عکس</div>
                     <input
                        required={true}
                        defaultValue={fullData?.imageAlt}
                        ref={imageAltRef}
                        type="text"
                        className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>توضیحات کوتاه جدید عکس</div>
                     <input
                        required={true}
                        defaultValue={fullData?.shortDesc}
                        ref={shortDescRef}
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
                        {fullData?.typeOfProduct == "book" ? (
                           <>
                              <option value={"book"}>کتاب</option>
                              <option value={"app"}>اپلیکیشن</option>
                              <option value={"gr"}>فایل گرافیکی</option>
                           </>
                        ) : fullData?.typeOfProduct == "app" ? (
                           <>
                              <option value={"app"}>اپلیکیشن</option>
                              <option value={"book"}>کتاب</option>
                              <option value={"gr"}>فایل گرافیکی</option>
                           </>
                        ) : (
                           <>
                              <option value={"gr"}>فایل گرافیکی</option>
                              <option value={"book"}>کتاب</option>
                              <option value={"app"}>اپلیکیشن</option>
                           </>
                        )}
                     </select>
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>انتشار و پیشنویس</div>
                     <select
                        ref={situationRef}
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     >
                        {fullData?.situation == true ? (
                           <>
                              <option value={"true"}>انتشار</option>
                              <option value={"false"}>پیشنویس</option>
                           </>
                        ) : (
                           <>
                              <option value={"false"}>پیشنویس</option>
                              <option value={"true"}>انتشار</option>
                           </>
                        )}
                     </select>
                  </div>
                  <button
                     type="submit"
                     className="py-2 bg-indigo-600 cursor-pointer text-white w-full rounded-md transition-all duration-500 hover:bg-orange-500"
                  >
                     به روز رسانی
                  </button>
               </form>
            </div>
         )}

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

export default CategoryDetails;
