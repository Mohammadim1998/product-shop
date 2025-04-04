"use client";
import React, { useEffect, useRef, useState } from "react";
import GraphicSlideBox from "@/components/graphicSlider/graphicSliderBox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BiFilterAlt } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

const goTopCtrl = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

type Product = {
    _id: string;
    buyNumber: number;
    categories: Category[];
    comments: string[];
    createdAt: string;
    features: string[];
    image: string;
    imageAlt: string;
    longDesc: string;
    pageView: number;
    price: string;
    published: boolean;
    relatedProducts: string[];
    shortDesc: string;
    slug: string;
    tags: string[];
    title: string;
    typeOfProduct: string;
    updatedAt: string;
}

type Category = {
    _id: string;
    slug: string;
    title: string;
}

type ApiResponse = {
    allProducts: Product[];
    btns: number[];
    productsNumber: number;
}

type ShopCompProps = {
    url: {
        keyword?: string;
        orderBy?: string;
        categories?: string;
        maxP?: string;
        minP?: string;
        type?: string;
        pgn?: string;
        pn?: string;
    };
}

const ShopComp: React.FC<ShopCompProps> = ({ url }) => {
    const router = useRouter();
    const [result, setResult] = useState<Product[] | null>(null);
    const [btns, setBtns] = useState<number[]>([-1]);
    const [title, setTitle] = useState<string>("");

    const [keyword, setKeyword] = useState(url.keyword ? `&keyword=${url.keyword}` : "");
    const [orderBy, setOrderBy] = useState(url.orderBy ? `&orderBy=${url.orderBy}` : "");

    const [categories, setCategories] = useState(url.categories ? `&categories=${url.categories}` : "");
    const [maxPrice, setMaxPrice] = useState(url.maxP ? `&maxP=${url.maxP}` : "&maxP=1000000000");
    const [minPrice, setMinPrice] = useState(url.minP ? `&minP=${url.minP}` : "&minP=0");
    const [minPriceInputNumber, setMinPriceInputNumber] = useState(url.minP ? url.minP : "1000000000");
    const [maxPriceInputNumber, setMaxPriceInputNumber] = useState(url.maxP ? url.maxP : "0");

    const [typeOfPro, setTypeOfPro] = useState(url.type ? `&type=${url.type}` : "");
    const [pgn, setPgn] = useState(url.pgn ? `&pgn=${url.pgn}` : "&pgn=12");
    const [pn, setPn] = useState(url.pn ? `&pn=${url.pn}` : "&pn=1");

    const [searchedProductsNumber, setSearchedProductsNumber] = useState<number>(0);

    const queries = `${keyword ? keyword : ""}${orderBy ? orderBy : ""}${typeOfPro ? typeOfPro : ""}${maxPrice ? maxPrice : ""}${minPrice ? minPrice : ""}${categories ? categories : ""}${pgn ? pgn : ""}${pn ? pn : ""}`;
    const mainFrontUrl = `/shop?${queries}`;
    const mainBackendUrl = `https://file-server.liara.run/api/search-products?${queries}`;

    const [resultLoading, setResultLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setMenutIsOpen(-1);
            setResult(null);
            setBtns([-1]);
            setPgn('&pgn=12');
            goTopCtrl();

            router.push(mainFrontUrl)
            await axios.get<ApiResponse>(mainBackendUrl)
                .then((d) => {
                    setResult(d.data.allProducts);
                    setBtns(d.data.btns);
                    setSearchedProductsNumber(d.data.productsNumber);
                })
                .catch((e) => {
                    setResultLoading(false);
                })
                .finally(() => {
                    setResultLoading(false);
                })
        }

        fetchData();
    }, [keyword, orderBy, categories, maxPrice, minPrice, typeOfPro, pgn, pn]);

    //KEYWORD
    useEffect(() => {
        url.keyword == undefined ? setTitle(``) : setTitle(url.keyword.split("_").join(" "));
        setPn(`&pn=1`);
        url.keyword && url.keyword.length > 0
            ? setKeyword(
                `&keyword=${url.keyword.replace(/\s+/g, '_').toLowerCase()}`
            )
            : console.log("");

    }, [url.keyword]);

    //ORDER BY
    const orderByManager = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setOrderBy(`&orderBy=${e.target.value}`);
        setPn(`&pn=1`);
    };

    //TYPE
    const typeOfProductManager = (v: React.ChangeEvent<HTMLInputElement>): void => {
        if (v.target.value == "allpros") {
            setTypeOfPro(``);
            url.keyword == undefined
                ? setTitle(``)
                : setTitle(url.keyword)
        } else {
            setTypeOfPro(`&type=${v.target.value}`);
            url.keyword == undefined
                ? setTitle(v.target.value === "app" ? `اپلیکیشن ها` : (v.target.value == "gr") ? `محصولات گرافیکی` : `کتاب ها`)
                : setTitle(v.target.value === "app" ? `${url.keyword} از اپلیکیشن ها` : (v.target.value == "gr") ? `${url.keyword} از محصولات گرافیکی` : `${url.keyword} از کتاب ها`)
        }
        setPn(`&pn=1`);
    };

    //PRICE
    const maxPRef = useRef<HTMLInputElement>(null);
    const minPRef = useRef<HTMLInputElement>(null);

    const priceManager = (e: React.FormEvent) => {
        e.preventDefault();

        if (!maxPRef.current || !minPRef.current) return;

        if (maxPRef.current.value == "" || parseInt(maxPRef.current.value) < 0) {
            maxPRef.current.value = "1000000000";
        }
        if (minPRef.current.value == "" || parseInt(minPRef.current.value) < 0) {
            minPRef.current.value = "0";
        }

        setMaxPrice(`&maxP=${maxPRef.current.value}`);
        setMinPrice(`&minP=${minPRef.current.value}`);
        setPn(`&pn=1`);
    };

    //CATEGORIES
    const [allCategories, setAllCategories] = useState<Category[] | null>(null);
    const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchData = async () => {
            const url = "https://file-server.liara.run/api/products-categories-rel";
            await axios.get<Category[]>(url)
                .then((d) => setAllCategories(d.data))
                .catch((e) => {
                    setCategoryLoading(false);
                })
                .finally(() => {
                    setCategoryLoading(false);
                })
        }

        fetchData();
    }, []);

    const categoriesManager = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            if (categories.length > 0) {
                setCategories(`${categories},${value}`);
            } else {
                setCategories(`&categories=${value}`);
            }
            setResult(null);
        } else {
            const numberOfComos = categories.split(",").length - 1;
            const a = categories.includes(`,${value}`)
                ? categories.replace(`,${value}`, "")
                : (numberOfComos == 0)
                    ? ""
                    : categories.replace(`${value},`, "");
            setCategories(a);
        }
        setPn(`&pn=1`);
    }

    // const urlCatsSlugs = url.categories ? url.categories.split(",") : [];
    // const urlCatsIds: string[] = [];
    // urlCatsSlugs && urlCatsSlugs?.map((c, i) => {
    //     for (let i = 0; i < allCategories.length; i++) {
    //         if (c == allCategories[i].slug) {
    //             urlCatsIds.push(allCategories[i]._id);
    //         }
    //     }
    // });
    const urlCatsSlugs = url.categories ? url.categories.split(",") : [];
    const urlCatsIds: string[] = [];
    if (allCategories) {
        urlCatsSlugs.forEach(slug => {
            const category = allCategories.find(c => c.slug === slug);
            if (category) {
                urlCatsIds.push(category._id);
            }
        });
    }

    //FOR RESPONSIVE
    const [menuIsOpen, setMenutIsOpen] = useState(-1);

    useEffect(() => {
        if (menuIsOpen == -1) {
            document.body.style.overflow = 'auto';
        } else if (menuIsOpen == 1) {
            document.body.style.overflow = 'hidden';
        }
    }, [menuIsOpen]);

    return (
        <div className="container mx-auto flex justify-between items-start gap-2">
            <aside
                className={
                    menuIsOpen == -1
                        ? "z-40 flex flex-col gap-4 bg-[#000000cc] md:bg-transparent md:w-80 py-4 md:py-0 h-[100vh] w-full md:h-auto fixed top-0 bottom-0 left-[100%] -right-[100%] md:left-0 md:right-0 md:relative transition-all duration-500"
                        : "z-50 flex flex-col gap-4 backdrop-blur-md bg-[#000000cc] md:bg-transparent md:w-80 py-4 md:py-0 h-[100vh] w-full overflow-auto md:h-auto fixed top-0 bottom-0 left-0 right-0 md:static transition-all duration-500"
                }>
                <div className="flex flex-col gap-4 bg-transparent md:bg-zinc-100 rounded-lg p-2">
                    <div className="text-white md:text-black">مرتب سازی بر اساس</div>
                    <div className="flex gap-2 items-center flex-wrap justify-center 2xl:justify-between">
                        <div className="flex gap-1 md:bg-transparent bg-zinc-100 items-center justify-center w-28 h-10 text-base sm:text-xs border-2 transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                            <label htmlFor="date">جدیدترین</label>
                            <input
                                type="radio"
                                name="orderBy"
                                id="date"
                                value={"date"}
                                onChange={orderByManager}
                                defaultChecked={orderBy == ""}
                            />
                        </div>

                        <div className="flex gap-1 md:bg-transparent bg-zinc-100 items-center justify-center w-28 h-10 text-base sm:text-xs border-2 transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                            <label htmlFor="price">قیمت</label>
                            <input
                                type="radio"
                                name="orderBy"
                                id="price"
                                value={"price"}
                                onChange={orderByManager}
                                defaultChecked={orderBy == "&orderBy=price"}
                            />
                        </div>

                        <div className="flex gap-1 md:bg-transparent bg-zinc-100 items-center justify-center w-28 h-10 text-base sm:text-xs border-2 transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                            <label htmlFor="pageView">پربازدید ترین</label>
                            <input
                                type="radio"
                                name="orderBy"
                                id="pageView"
                                value={"pageView"}
                                onChange={orderByManager}
                                defaultChecked={orderBy == "&orderBy=pageView"}
                            />
                        </div>

                        <div className="flex gap-1 md:bg-transparent bg-zinc-100 items-center justify-center w-28 h-10 text-base sm:text-xs border-2 transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                            <label htmlFor="buyNumber">پرفروش ترین</label>
                            <input
                                type="radio"
                                name="orderBy"
                                id="buyNumber"
                                value={"buyNumber"}
                                onChange={orderByManager}
                                defaultChecked={orderBy == "&orderBy=buyNumber"}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-transparent md:bg-zinc-100 rounded-lg p-2">
                    <div className="text-white md:text-black">نوع محصول</div>
                    <div className="flex gap-2 items-center flex-wrap justify-center 2xl:justify-between">
                        <div className="flex gap-1 md:bg-transparent bg-zinc-100 items-center justify-center w-28 h-10 text-base sm:text-xs border-2  transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                            <label htmlFor="allpros">همه</label>
                            <input
                                type="radio"
                                name="typeOfProduct"
                                id="allpros"
                                value={"allpros"}
                                onChange={typeOfProductManager}
                                defaultChecked={orderBy == ''}
                            />
                        </div>

                        <div className="flex gap-1 md:bg-transparent bg-zinc-100 items-center justify-center w-28 h-10 text-base sm:text-xs border-2  transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                            <label htmlFor="app">اپلیکیشن</label>
                            <input
                                type="radio"
                                name="typeOfProduct"
                                id="app"
                                value={"app"}
                                onChange={typeOfProductManager}
                                defaultChecked={typeOfPro == '&type=app'}
                            />
                        </div>

                        <div className="flex gap-1 md:bg-transparent bg-zinc-100 items-center justify-center w-28 h-10 text-base sm:text-xs border-2  transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                            <label htmlFor="book">کتاب</label>
                            <input
                                type="radio"
                                name="typeOfProduct"
                                id="book"
                                value={"book"}
                                onChange={typeOfProductManager}
                                defaultChecked={typeOfPro == '&type=book'}
                            />
                        </div>

                        <div className="flex gap-1 md:bg-transparent bg-zinc-100 items-center justify-center w-28 h-10 text-base sm:text-xs border-2  transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                            <label htmlFor="gr">فایل گرافیکی</label>
                            <input
                                type="radio"
                                name="typeOfProduct"
                                id="gr"
                                value={"gr"}
                                onChange={typeOfProductManager}
                                defaultChecked={typeOfPro == '&type=gr'}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-transparent md:bg-zinc-100 rounded-lg p-2">
                    <div className="text-white md:text-black">(تومان) بازه قیمت</div>
                    <form onSubmit={priceManager} className="flex gap-4 flex-col">
                        <div className="flex gap-2 items-center  flex-wrap justify-center 2xl:justify-between">
                            <input
                                ref={minPRef}
                                defaultValue={minPriceInputNumber}
                                className="inputLtr md:bg-transparent bg-zinc-100 text-center w-28 h-10 text-base sm:text-xs border-2 transition-all duration-300 outline-none focus:border-blue-400 border-zinc-200 rounded"
                                type="number"
                                placeholder="حداقل قیمت"
                                min={0}
                            />
                            <input
                                ref={maxPRef}
                                defaultValue={maxPriceInputNumber}
                                className="inputLtr md:bg-transparent bg-zinc-100 text-center w-28 h-10 text-base sm:text-xs border-2 transition-all duration-300 outline-none focus:border-blue-400 border-zinc-200 rounded"
                                type="number"
                                placeholder="حداکثر قیمت"
                                min={0}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button type="submit"
                                className="w-60 md:w-full text-center bg-orange-400 p-2 rounded h-10 flex justify-center items-center text-white transition-all duration-500"
                            >
                                اعمال فیلتر قیمت
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex flex-col gap-4 bg-transparent md:bg-zinc-100 rounded-lg p-2">
                    <div className="text-white md:text-black">دسته بندی</div>
                    <div className="flex gap-2 items-center flex-wrap justify-between">
                        {categoryLoading
                            ? <div className="w-full flex justify-center items-center p-12">
                                <Image
                                    alt="loading"
                                    width={40}
                                    height={40}
                                    src={"/loading.svg"}
                                />
                            </div>
                            : allCategories && allCategories?.length < 1
                                ? (<div>دسته ای موجود نیست</div>)
                                : (
                                    <div className="flex justify-center items-center w-full">
                                        <div className="flex gap-2 flex-wrap justify-around items-center">
                                            {allCategories && allCategories?.map((category, index) => (
                                                <div
                                                    key={index}
                                                    className="md:bg-transparent bg-zinc-100 w-28 flex gap-1 items-center justify-between p-2 text-base sm:text-xs border-2  transition-all duration-300 hover:border-blue-400 border-zinc-200 rounded">
                                                    <label htmlFor={category.slug}>{category.title}</label>
                                                    {urlCatsIds && urlCatsIds?.length < 1
                                                        ? (<input
                                                            onChange={categoriesManager}
                                                            type="checkbox"
                                                            id={category.slug}
                                                            value={category.slug}
                                                        />
                                                        ) : (<input
                                                            onChange={categoriesManager}
                                                            type="checkbox"
                                                            id={category.slug}
                                                            value={category.slug}
                                                            defaultChecked={urlCatsIds.includes(category._id)}
                                                        />
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>)}
                    </div>
                </div>
            </aside>

            <main className="bg-zinc-100 rounded-lg p-2 w-full flex flex-col gap-8 pt-10 md:pt-0 px-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl text-indigo-600">محصولات <span className="text-balance md:text-xl text-indigo-600 font-semibold ">{title}</span> فروشگاه فایل مرنفا </h1>
                    <div className="text-base sm:text-sm rounded-md border-2 border-indigo-600 w-20 h-8 flex justify-center items-center">{searchedProductsNumber} محصول</div></div>
                <div className="flex flex-col gap-6">
                    <section className="flex justify-center lg:justify-between items-center gap-4 flex-wrap">
                        {resultLoading ? (
                            <div className="w-full flex justify-center items-center p-12">
                                <Image
                                    alt="loading"
                                    width={120}
                                    height={120}
                                    src={"/loading.svg"}
                                />
                            </div>
                        ) : result && result?.length < 1 ? (
                            <div>محصولی با این شرایط موجود نیست...</div>
                        ) : (
                            <div className="flex justify-center md:justify-between flex-wrap">
                                {
                                    result && result?.map((product) => (<GraphicSlideBox key={product._id} itemData={product} />))
                                }
                            </div>
                        )}
                    </section>

                    <section className="flex justify-center items-center gap-4 flex-wrap">
                        {
                            btns[0] == -1
                                ? (<div className="w-full flex justify-center items-center p-12">
                                    <Image
                                        alt="loading"
                                        width={120}
                                        height={120}
                                        src={"/loading.svg"}
                                    />
                                </div>)
                                : btns.map((btn, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (pn == `&pn=${btn + 1}`) {
                                                goTopCtrl();
                                            } else {
                                                setPn(`&pn=${btn + 1}`);
                                                setPgn(`&pgn=12`);
                                                goTopCtrl();
                                                setResult(null);
                                            }
                                        }}
                                        className={`${pn == `&pn=${btn + 1}`
                                            ? "bg-orange-400 text-white w-8 h-8 flex justify-center items-center rounded transition-all duration-500 hover:bg-orange-500"
                                            : "bg-indigo-500 text-white w-8 h-8 flex justify-center items-center rounded transition-all duration-500 hover:bg-orange-500"
                                            }`}>{btn + 1}</button>
                                ))}
                    </section>
                </div>
            </main>

            <div className="z-50 flex md:hidden fixed top-2 left-5">
                <BiFilterAlt
                    onClick={() => setMenutIsOpen(menuIsOpen * -1)}
                    className={
                        menuIsOpen == -1
                            ? "w-10 h-10 text-white bg-orange-500 p-1 rounded hover:bg-orange-600 transition-all duration-300 flex"
                            : "w-10 h-10 text-white bg-orange-500 p-1 rounded hover:bg-orange-600 transition-all duration-300 hidden"
                    } />

                <IoMdClose
                    onClick={() => setMenutIsOpen(menuIsOpen * -1)}
                    className={
                        menuIsOpen == 1
                            ? "w-10 h-10 text-white bg-orange-500 p-1 rounded hover:bg-orange-600 transition-all duration-300 flex"
                            : "w-10 h-10 text-white bg-orange-500 p-1 rounded hover:bg-orange-600 transition-all duration-300 hidden"
                    } />
            </div>
        </div>
    )
}

export default ShopComp;