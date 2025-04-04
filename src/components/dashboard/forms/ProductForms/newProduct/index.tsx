"use client";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

type Category = {
   _id: string;
   title: string;
   slug: string;
}

type Product = {
   _id: string;
   title: string;
}


const NewProduct = () => {
   //FOR SPLIT CATEGORIES
   const splitForCategories = (value: string): string[] => {
      return value.split("*");
   }

   const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
   const titleRef = useRef<HTMLInputElement>(null);
   const slugRef = useRef<HTMLInputElement>(null);
   const mainFileRef = useRef<HTMLInputElement>(null);
   const imageRef = useRef<HTMLInputElement>(null);
   const imageAltRef = useRef<HTMLInputElement>(null);
   const priceRef = useRef<HTMLInputElement>(null);
   const shortDescRef = useRef<HTMLInputElement>(null);
   const longDescRef = useRef<HTMLTextAreaElement>(null);
   const typeOfProductRef = useRef<HTMLSelectElement>(null);
   const publishedRef = useRef<HTMLSelectElement>(null);

   // TAG MANAGING
   const tagRef = useRef<HTMLInputElement>(null);
   const [tag, setTag] = useState<string[]>([]);
   const tagSuber = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         e.preventDefault();
         let tagList = [...tag];
         const data = tagRef.current?.value;
         if (data && data.length > 0) {
            tagList = [...tag, data.replace(/\s+/g, '_').toLowerCase()];
            setTag(tagList);
         }
         if (tagRef.current) {
            tagRef.current.value = "";
         }
      }
   };
   const tagDeleter = (indexToRemove: number) => {
      setTag(tag.filter((_, index) => index !== indexToRemove));
   };
   // FEATURE MANAGING
   const featuresRef = useRef<HTMLInputElement>(null);
   const [feature, setFeature] = useState<string[]>([]);
   const featureSuber = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         e.preventDefault();
         let featureList = [...feature];
         const data = featuresRef.current?.value;
         if (data && data.length > 0) {
            featureList = [...feature, data];
            setFeature(featureList);
         }
         if (featuresRef.current) {
            featuresRef.current.value = "";
         }
      }
   };
   const featureDeleter = (indexToRemove: number) => {
      setFeature(feature.filter((_, index) => index !== indexToRemove));
   };
   // RELATED
   const [products, setProducts] = useState<Product[]>([]);
   const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

   useEffect(() => {
      const productUrl = "https://file-server.liara.run/api/products-rel";
      axios
         .get(productUrl, { headers: { auth_cookie: auth_cookie } })
         .then((d) => {
            setProducts(d.data);
         })
         .catch((e) => {
            console.log(e);
            setLoadingProducts(false);
         })
         .finally(() => {
            setLoadingProducts(false);
         })
   }, []);

   const [relProducts, setrelProducts] = useState<string[]>([]);
   const productsRelatedMan = (e: React.ChangeEvent<HTMLInputElement>) => {
      let productId = e.target.value;
      if (e.target.checked) {
         setrelProducts(prev => [...prev, productId]);
      } else {
         setrelProducts(prev => prev.filter(id => id !== productId));
      }
   };

   // RELATED
   const [categories, setCategories] = useState<Category[]>([]);
   const [loadingCategory, setLoadingCategory] = useState<boolean>(true);

   useEffect(() => {
      const postsUrl = "https://file-server.liara.run/api/products-categories-rel";
      axios
         .get(postsUrl, { headers: { auth_cookie: auth_cookie } })
         .then((d) => {
            setCategories(d.data);
         })
         .catch((e) => {
            setLoadingCategory(false);
         })
         .finally(() => {
            setLoadingCategory(false);
         })
   }, []);

   const [relCategories, setrelCategories] = useState<Category[]>([]);
   const productsCategoriesMan = (v: React.ChangeEvent<HTMLInputElement>) => {
      let related = [...relCategories];
      if (v.target.checked) {
         const goalArr = splitForCategories(v.target.value);
         related = [...related, {
            _id: goalArr[0],
            title: goalArr[1],
            slug: goalArr[2],
         }];
      } else {
         const goalArr = splitForCategories(v.target.value);
         related = related.filter(item =>
            !(item._id === goalArr[0] && item.title === goalArr[1] && item.slug === goalArr[2])
         );
      }
      setrelCategories(related);
   };

   const submiter = (e: React.FormEvent) => {
      e.preventDefault();

      if (
         !titleRef.current ||
         !slugRef.current ||
         !mainFileRef.current ||
         !imageRef.current ||
         !imageAltRef.current ||
         !priceRef.current ||
         !shortDescRef.current ||
         !typeOfProductRef.current ||
         !longDescRef.current ||
         !publishedRef.current
      ) {
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
         createdAt: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
         }),
         updatedAt: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
         }),
         slug: slugRef.current.value,
         mainFile: mainFileRef.current.value,
         image: imageRef.current.value,
         imageAlt: imageAltRef.current.value,
         price: priceRef.current.value,
         shortDesc: shortDescRef.current.value,
         longDesc: longDescRef.current.value,
         tags: tag,
         features: feature,
         typeOfProduct: typeOfProductRef.current.value,

         pageView: 0,
         published: publishedRef.current.value,
         comments: [],
         relatedProducts: relProducts,
         categories: relCategories,
      };
      const url = `https://file-server.liara.run/api/new-product`;
      axios
         .post(url, formData, { headers: { auth_cookie: auth_cookie } })
         .then((d) => {
            formData.published == "true"
               ? toast.success("محصول با موفقیت منتشر شد.", {
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
               })
               : toast.success("محصول به صورت پیشنویس ذخیره شد.", {
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
         <h2 className=" text-orange-500">محصول جدید</h2>
         <form
            onKeyDown={formKeyNotSuber}
            onSubmit={submiter}
            className=" flex flex-col gap-6"
         >
            <div className=" flex flex-col gap-2">
               <div>عنوان محصول</div>
               <input
                  required={true}
                  ref={titleRef}
                  type="text"
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               />
            </div>
            <div className=" flex flex-col gap-2">
               <div>اسلاگ پست</div>
               <input
                  required={true}
                  ref={slugRef}
                  type="text"
                  className=" inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               />
            </div>
            <div className=" flex flex-col gap-2">
               <div>URL فایل اصلی محصول</div>
               <input
                  required={true}
                  ref={mainFileRef}
                  type="text"
                  className=" inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               />
            </div>
            <div className=" flex flex-col gap-2">
               <div>آدرس عکس</div>
               <input
                  required={true}
                  ref={imageRef}
                  type="text"
                  className=" inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
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
               <div>قیمت محصول (تومان)</div>
               <input
                  required={true}
                  ref={priceRef}
                  type="number"
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
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
               <div>توضیحات کامل</div>
               <textarea
                  required={true}
                  ref={longDescRef}
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               // rows="8"
               />
            </div>
            <div className="tags flex flex-col gap-2">
               <h3>برچسب ها</h3>
               <div className="tags w-full flex flex-col gap-4">
                  <div className="input flex gap-2 items-center">
                     <input
                        type="text"
                        onKeyDown={tagSuber}
                        ref={tagRef}
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                        placeholder="تگ را وارد کنید و انتر بزنید..."
                     />
                  </div>
                  <div className="tagResults flex gap-3 justify-start flex-wrap">
                     {tag.map((t, index) => {
                        return (
                           <div
                              key={t}
                              className="res flex gap-1 text-sm py-1 px-2 rounded-md border-2 border-zinc-300"
                           >
                              <i
                                 className="text-indigo-500 flex items-center cursor-pointer"
                                 onClick={() => {
                                    tagDeleter(index);
                                 }}
                              >
                                 <span className="text-xs">{t}</span>
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="M6 18L18 6M6 6l12 12"
                                    />
                                 </svg>
                              </i>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>
            <div className="tags flex flex-col gap-2">
               <h3>ویژگی ها</h3>
               <div className="tags w-full flex flex-col gap-4">
                  <div className="input flex gap-2 items-center">
                     <input
                        type="text"
                        onKeyDown={featureSuber}
                        ref={featuresRef}
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                        placeholder="نام ویژگی: توضیحات ویژگی"
                     />
                  </div>
                  <div className="tagResults flex gap-3 justify-start flex-wrap">
                     {feature.map((t, index) => {
                        return (
                           <div
                              key={t}
                              className="res flex gap-1 text-sm py-1 px-2 rounded-md border-2 border-zinc-300"
                           >
                              <i
                                 className="text-indigo-500 flex items-center cursor-pointer"
                                 onClick={() => {
                                    featureDeleter(index);
                                 }}
                              >
                                 <span className="text-xs">{t}</span>
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="M6 18L18 6M6 6l12 12"
                                    />
                                 </svg>
                              </i>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-2">
               <div>منتشر شود</div>
               <select
                  ref={publishedRef}
                  className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400">
                  <option value={"true"}>انتشار</option>
                  <option value={"false"}>پیشنویس</option>
               </select>
            </div>

            <div className=" flex flex-col gap-2">
               <div>نوع محصول</div>
               <select
                  ref={typeOfProductRef}
                  className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
               >
                  <option value={"book"}>کتاب</option>
                  <option value={"app"}>اپلیکیشن</option>
                  <option value={"gr"}>فایل گرافیکی</option>
               </select>
            </div>

            <div className="tags flex flex-col gap-2">
               <h3>دسته بندی ها </h3>
               {loadingCategory ? (
                  <div className=" flex justify-center items-center p-12">
                     <Image
                        alt="loading"
                        width={40}
                        height={40}
                        src={"/loading.svg"}
                     />
                  </div>
               ) : categories && categories?.length < 1 ? (
                  <div className=" p-3">دسته ای یافت نشد</div>
               ) : (
                  <div className=" flex justify-start items-center flex-wrap gap-2">
                     {categories && categories?.map((po, i) => (
                        <div key={i} className="flex justify-center items-center gap-x-2 px-2 py-1 bg-zinc-100 rounded">
                           <label htmlFor={po._id}>{po.title}</label>
                           <input
                              value={`${po._id}*${po.title}*${po._id}`}
                              name={po._id}
                              id={po._id}
                              onChange={productsCategoriesMan}
                              type="checkbox"
                           />
                        </div>
                     ))}
                  </div>
               )}
            </div>

            <div className="tags flex flex-col gap-2">
               <h3>محصولات مرتبط</h3>
               {loadingProducts ? (
                  <div className=" flex justify-center items-center p-12">
                     <Image
                        alt="loading"
                        width={40}
                        height={40}
                        src={"/loading.svg"}
                     />
                  </div>
               ) : products && products.length < 1 ? (
                  <div className=" p-3">محصولی یافت نشد</div>
               ) : (
                  <div className=" flex justify-start items-center flex-wrap gap-2">
                     {products && products.map((po, i) => (
                        <div key={i} className="flex justify-center items-center gap-x-2 px-2 py-1 bg-zinc-100 rounded">
                           <label htmlFor={po._id}>{po.title}</label>
                           <input
                              value={`${po._id}*${po.title}*${po._id}`}
                              name={po._id}
                              id={po._id}
                              onChange={productsRelatedMan}
                              type="checkbox"
                           />
                        </div>
                     ))}
                  </div>
               )}
            </div>

            <button
               type="submit"
               className="py-2 cursor-pointer bg-indigo-600 text-white w-full rounded-md transition-all duration-500 hover:bg-orange-500"
            >
               ارسال
            </button>
         </form>
         <ToastContainer
            bodyClassName={() => "font-[shabnam] text-sm"}
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

export default NewProduct;