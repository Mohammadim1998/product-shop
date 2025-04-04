"use client";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

type ProductDetailsPropsTypes = {
   goalId: string;
}

type CategoryType = {
   _id: string;
   title: string;
   slug: string;
};

type ProductType = {
   _id: string;
   title: string;
   // slug: string;
};

type FullDataType = {
   _id?: string;
   title?: string;
   createdAt?: string;
   updatedAt?: string;
   slug?: string;
   mainFile?: string;
   image?: string;
   imageAlt?: string;
   price?: string;
   shortDesc?: string;
   longDesc?: string;
   tags?: string[];
   features?: string[];
   typeOfProduct?: string;
   published?: boolean;
   relatedProducts?: string[];
   categories?: CategoryType[];
   pageView?: number;
   comments?: any[];
};

const ProductsDetails: React.FC<ProductDetailsPropsTypes> = ({ goalId }) => {
   //FOR SPLIT CATEGORIES
   const splitForCategories = (value: string) => {
      return value.split("*");
   }

   const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));

   // FORM SHOULD BE NOT SEND WITH ENTER KEY
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
            tagList = [...tag, data.replace(/\s+/g, "_").toLowerCase()];
            setTag(tagList);
         }
         if (tagRef.current) tagRef.current.value = "";
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
         if (featuresRef.current) featuresRef.current.value = "";
      }
   };
   const featureDeleter = (indexToRemove: number) => {
      setFeature(feature.filter((_, index) => index !== indexToRemove));
   };

   // RELATED
   const [products, setProducts] = useState<ProductType[] | null>(null);
   const [loadingProducts, setLoadingProducts] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const productUrl = "https://file-server.liara.run/api/products-rel";
            await axios.get(productUrl, { headers: { auth_cookie: auth_cookie } })
               .then((d) => {
                  setProducts(d.data);
               })
               .catch((e) => {
                  setLoadingProducts(false);
               })
               .finally(() => {
                  setLoadingProducts(false);
               })
         } catch (error) {
            console.log(error);
         }
      }

      fetchData();
   }, []);


   // const productsRelatedMan = (e: React.ChangeEvent<HTMLInputElement>) => {
   //    let related = [...relProducts];
   //    if (e.target.checked) {
   //       related = [...related, e.target.value];
   //    } else {
   //       related.splice(relProducts.indexOf(e.target.value), 1);
   //    }
   //    setRelProducts(related);
   // };
   const [relProducts, setRelProducts] = useState<string[]>([]);
   const productsRelatedMan = (e: React.ChangeEvent<HTMLInputElement>) => {
      let productId = e.target.value;
      if (e.target.checked) {
         setRelProducts(prev => [...prev, productId]);
      } else {
         setRelProducts(prev => prev.filter(id => id !== productId));
      }
   };

   // CATEGORIES
   const [categories, setCategories] = useState<CategoryType[]>([]);
   const [loadingCategory, setLoadingCategory] = useState<boolean>(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const postsUrl = "https://file-server.liara.run/api/products-categories-rel";
            await axios.get(postsUrl, { headers: { auth_cookie: auth_cookie } })
               .then((d) => {
                  setCategories(d.data);
               })
               .catch((e) => {
                  setLoadingCategory(false);
               })
               .finally(() => {
                  setLoadingCategory(false);
               })
         } catch (error) {
            console.log(error);
         }
      }

      fetchData();
   }, []);

   const [relCategories, setRelCategories] = useState<CategoryType[]>([]);
   const [thisProductCatsIds, setThisProductCatsIds] = useState<string[]>([]);

   const productsCategoriesMan = (e: React.ChangeEvent<HTMLInputElement>) => {
      let related = [...relCategories];
      if (e.target.checked) {
         const goalArr = splitForCategories(e.target.value);
         related = [
            ...related,
            {
               _id: goalArr[0],
               title: goalArr[1],
               slug: goalArr[2],
            },
         ];
      } else {
         const goalArr = splitForCategories(e.target.value);
         related = related.filter(
            (item) =>
               !(
                  item._id === goalArr[0] &&
                  item.title === goalArr[1] &&
                  item.slug === goalArr[2]
               )
         );
      }
      setRelCategories(related);
   };

   // FORM SHOULD BE NOT SEND WITH ENTER KEY
   const formKeyNotSuber = (event: React.KeyboardEvent) => {
      if (event.key == "Enter") {
         event.preventDefault();
      }
   };

   const updater = (e: React.FormEvent) => {
      e.preventDefault();

      if (
         !titleRef.current ||
         !slugRef.current ||
         !mainFileRef.current ||
         !imageRef.current ||
         !imageAltRef.current ||
         !priceRef.current ||
         !shortDescRef.current ||
         !longDescRef.current ||
         !typeOfProductRef.current ||
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
         relatedProducts: relProducts,
         typeOfProduct: typeOfProductRef.current.value,
         features: feature,
         published: publishedRef.current.value,
         categories: relCategories,
      };

      try {
         const url = `https://file-server.liara.run/api/update-product/${goalId}`;
         axios.post(url, formData, { headers: { auth_cookie: auth_cookie } })
            .then((d) => {
               formData?.published == "true"
                  ? toast.success("محصول با موفقیت به روز رسانی شد.", {
                     autoClose: 3000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                  })
                  : toast.success("محصول با موفقیت به روز رسانی و به صورت پیشنویس ذخیره شد.", {
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
               if (e.response?.data?.msg) {
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
               console.log("formData: ", formData);

            });
      } catch (error) {
         console.log(error);
      }
   };

   const remover = () => {
      try {
         const url = `https://file-server.liara.run/api/delete-product/${goalId}`;
         axios.post(url, { headers: { auth_cookie: auth_cookie } })
            .then((d) => {
               toast.success("محصول با موفقیت حذف شد.", {
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
      } catch (error) {
         console.log(error);
      }
   };

   // LOADING DEFAULT VALUES
   const [fullData, setfullData] = useState<FullDataType | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            await axios.get(`https://file-server.liara.run/api/get-product-by-id/${goalId}`, { headers: { auth_cookie: auth_cookie } })
               .then((d) => {
                  setfullData(d.data);
                  setTag(d.data.tags);
                  setFeature(d.data.features);
                  setRelProducts(d.data.relatedProducts);
                  setRelCategories(d.data.categories);
                  setThisProductCatsIds(d.data.categories?.map((c: CategoryType) => c._id));
               })
               .catch((e) => {
                  toast.error("خطا در لود اطلاعات", {
                     autoClose: 3000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                  })
                  setLoading(false);
               })
               .finally(() => {
                  setLoading(false);
               })
         } catch (error) {
            console.log(error);
         }
      }

      fetchData();
   }, [goalId]);

   return (
      <div className="flex flex-col gap-8">
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
                  <h2 className=" text-orange-500">جزئیات محصول</h2>
                  <div className=" flex justify-end items-center gap-4 text-white">
                     <Link
                        target="_blank"
                        href={`/shop/${fullData?.slug}`}
                        className=" bg-blue-600 px-4 py-1 rounded-md text-sm transition-all duration-500 hover:bg-blue-700"
                     >
                        لینک پست
                     </Link>
                     <button
                        onClick={() => remover()}
                        className="bg-rose-600 cursor-pointer text-white px-4 py-1 rounded-md text-xs transition-all duration-500 hover:bg-rose-700"
                     >
                        حذف
                     </button>
                  </div>
               </div>
               <div className=" flex justify-between items-center">
                  <div className=" bg-zinc-100 rounded px-3 py-1 text-sm">
                     {fullData?._id ? fullData?._id : ""}
                  </div>
                  <div className=" bg-zinc-100 rounded px-3 py-1 text-sm">
                     تاریخ ایجاد{fullData?.createdAt ? fullData?.createdAt : ""}
                  </div>
                  <div className=" bg-zinc-100 rounded px-3 py-1 text-sm">
                     به روز رسانی{fullData?.updatedAt ? fullData?.updatedAt : ""}
                  </div>
                  <div className=" bg-zinc-100 rounded px-3 py-1 text-sm">
                     {fullData?.pageView ? fullData?.pageView : 0} بازدید
                  </div>
                  <div className=" bg-zinc-100 rounded px-3 py-1 text-sm">
                     {fullData?.pageView ? fullData?.pageView : 0} فروش
                  </div>
                  <div className=" bg-zinc-100 rounded px-3 py-1 text-sm">
                     {fullData?.comments ? fullData?.comments.length : 0} دیدگاه
                  </div>
               </div>

               <form
                  onKeyDown={formKeyNotSuber}
                  onSubmit={updater}
                  className=" flex flex-col gap-6"
               >
                  <div className=" flex flex-col gap-2">
                     <div>عنوان جدید محصول</div>
                     <input
                        defaultValue={fullData?.title ? fullData?.title : ""}
                        required={true}
                        ref={titleRef}
                        type="text"
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>اسلاگ جدید پست</div>
                     <input
                        defaultValue={fullData?.slug ? fullData?.slug : ""}
                        required={true}
                        ref={slugRef}
                        type="text"
                        className=" inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>URL فایل اصلی جدید محصول</div>
                     <input
                        defaultValue={fullData?.mainFile ? fullData?.mainFile : ""}
                        required={true}
                        ref={mainFileRef}
                        type="text"
                        className=" inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>آدرس جدید عکس</div>
                     <input
                        defaultValue={fullData?.image ? fullData?.image : ""}
                        required={true}
                        ref={imageRef}
                        type="text"
                        className=" inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>آلت جدید عکس</div>
                     <input
                        defaultValue={
                           fullData?.imageAlt ? fullData?.imageAlt : ""
                        }
                        required={true}
                        ref={imageAltRef}
                        type="text"
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>قیمت جدید محصول (تومان)</div>
                     <input
                        defaultValue={
                           fullData?.price ? fullData?.price : ""
                        }
                        required={true}
                        ref={priceRef}
                        type="number"
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>توضیحات کوتاه جدید</div>
                     <input
                        defaultValue={
                           fullData?.shortDesc ? fullData?.shortDesc : ""
                        }
                        required={true}
                        ref={shortDescRef}
                        type="text"
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     />
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>توضیحات کامل جدید</div>
                     <textarea
                        defaultValue={
                           fullData?.longDesc ? fullData?.longDesc : ""
                        }
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
                                       className="text-indigo-500 flex items-center"
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
                     <h3>ویژگی های جدید </h3>
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
                  <div className=" flex flex-col gap-2">
                     <div>نوع محصول</div>
                     <select
                        ref={typeOfProductRef}
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     >
                        {fullData?.typeOfProduct && fullData?.typeOfProduct == "book" ? (
                           <>
                              <option value={"book"}>کتاب</option>
                              <option value={"app"}>اپلیکیشن</option>
                              <option value={"gr"}>فایل گرافیکی</option>
                           </>
                        ) : fullData?.typeOfProduct &&
                           fullData?.typeOfProduct == "app" ? (
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
                  <div className="tags flex flex-col gap-2">
                     <h3>دسته بندی های محصول</h3>
                     {loadingCategory ? (
                        <div className=" flex justify-center items-center p-12">
                           <Image
                              alt="loading"
                              width={40}
                              height={40}
                              src={"/loading.svg"}
                           />
                        </div>
                     ) : categories && categories.length < 1 ? (
                        <div className=" p-3">دسته ای یافت نشد</div>
                     ) : (
                        <div className=" flex justify-start items-center flex-wrap gap-2">
                           {categories && categories?.map((po, i) => (
                              <div
                                 key={i}
                                 className="flex justify-center items-center gap-x-2 px-2 py-1 bg-zinc-100 rounded"
                              >
                                 <label htmlFor={po._id}>{po.title}</label>{" "}
                                 {
                                    thisProductCatsIds.includes(po._id) ? (
                                       <input
                                          name={po._id}
                                          id={po._id}
                                          value={`${po._id}*${po.title}*${po._id}`}
                                          onChange={productsCategoriesMan}
                                          type="checkbox"
                                          defaultChecked
                                       />
                                    ) : (
                                       <input
                                          name={po._id}
                                          id={po._id}
                                          value={`${po._id}*${po.title}*${po._id}`}
                                          onChange={productsCategoriesMan}
                                          type="checkbox"
                                       />
                                    )}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
                  <div className="tags flex flex-col gap-2">
                     <h3>محصولات مرتبط</h3>
                     {loadingProducts ? (
                        <div className=" flex justify-center items-center p-12">
                           <Image alt="loading" width={40} height={40} src={"/loading.svg"} />
                        </div>
                     ) : products && products?.length < 1 ? (
                        <div className=" p-3">محصولی یافت نشد</div>
                     ) : (
                        <div className=" flex justify-start items-center flex-wrap gap-2">
                           {products && products?.map((product, i) => (
                              <div
                                 key={i}
                                 className="flex justify-center items-center gap-x-2 px-2 py-1 bg-zinc-100 rounded"
                              >
                                 <label htmlFor={product._id}>{product.title}</label>{" "}
                                 {fullData?.relatedProducts &&
                                    fullData?.relatedProducts.includes(product._id) ? (
                                    <input
                                       name={product._id}
                                       id={product._id}
                                       value={product._id}
                                       onChange={productsRelatedMan}
                                       type="checkbox"
                                       defaultChecked
                                    />
                                 ) : (
                                    <input
                                       name={product._id}
                                       id={product._id}
                                       value={product._id}
                                       onChange={productsRelatedMan}
                                       type="checkbox"
                                    />
                                 )}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
                  <div className=" flex flex-col gap-2">
                     <div>منتشر شود</div>
                     <select
                        ref={publishedRef}
                        className=" p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                     >
                        {fullData?.published && fullData?.published == true ? (
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

export default ProductsDetails;
