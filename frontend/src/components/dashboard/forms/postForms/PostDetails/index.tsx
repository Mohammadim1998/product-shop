"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

type PostDetailsPropsTypes = {
    goalId: string;
}

type ItemPostPropsTypes = {
    comments: string[];
    createdAt: string;
    image: string;
    imageAlt: string;
    longDesc: string;
    pageView: number;
    published: boolean;
    relatedPosts: string[];
    shortDesc: string;
    slug: string;
    tags: string[];
    title: string;
    type: string;
    updatedAt: string;
    _id: string;
}

type PostsTagsPropsTypes = {
    title: string;
    _id: string;
}
const PostDetails: React.FC<PostDetailsPropsTypes> = ({ goalId }) => {
    const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const titleRef = useRef<HTMLInputElement>(null);
    const slugRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const imageAltRef = useRef<HTMLInputElement>(null);
    const shortDescRef = useRef<HTMLInputElement>(null);
    const longDescRef = useRef<HTMLTextAreaElement>(null);
    const publishedRef = useRef<HTMLSelectElement>(null);

    const formKeyNotSuber = (event: React.KeyboardEvent) => {
        if (event.key == "Enter") {
            event.preventDefault();
        }
    };
    // TAG MANAGING
    const tagRef = useRef<HTMLInputElement>(null);
    const [tag, setTag] = useState<string[]>([]);
    const tagSuber = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const data = tagRef.current?.value;
            if (data && data.length > 0) {
                setTag(prev => [...prev, data]);
                if (tagRef.current) {
                    tagRef.current.value = "";
                }
            }
        }
    };

    const tagDeleter = (indexToRemove: number) => {
        setTag(tag.filter((_, index) => index !== indexToRemove));
    };

    // RELATED
    const [posts, setPosts] = useState<PostsTagsPropsTypes[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsUrl = "https://file-server.liara.run/api/posts-rel";
                await axios.get(postsUrl, { headers: { auth_cookie: auth_cookie } })
                    .then((d) => {
                        setPosts(d.data);
                    })
                    .catch((e) => console.log("error in loading posts"));
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    const [relPosts, setRelPosts] = useState<string[]>([]);

    // const postsRelatedManager = (e:React.ChangeEvent<HTMLInputElement>) => {
    //     let related: string[] = [...relPosts];
    //     if (e.target.checked) {
    //         related = [...related, e.target.value];
    //     } else {
    //         related.splice(posts.indexOf(e.target.value), 1)
    //     }
    //     setRelPosts(related);
    // }
    const postsRelatedManager = (e: React.ChangeEvent<HTMLInputElement>) => {
        const postId = e.target.value;
        if (e.target.checked) {
            setRelPosts(prev => [...prev, postId]);
        } else {
            setRelPosts(prev => prev.filter(id => id !== postId));
        }
    }

    //Loading default values
    const [fullData, setFullData] = useState<ItemPostPropsTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`https://file-server.liara.run/api/get-post-by-id/${goalId}`, { headers: { auth_cookie: auth_cookie } })
                    .then((d) => {
                        setFullData(d.data);
                        setTag(d.data.tags);
                        setRelPosts(d.data.relatedPosts);
                    })
                    .catch(error => {
                        console.log(error);
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

    const updater = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !titleRef.current ||
            !slugRef.current ||
            !imageRef.current ||
            !imageAltRef.current ||
            !shortDescRef.current ||
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
            updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            slug: slugRef.current.value,
            image: imageRef.current.value,
            imageAlt: imageAltRef.current.value,
            shortDesc: shortDescRef.current.value,
            longDesc: longDescRef.current.value,
            tags: tag,
            relatedPosts: relPosts,
            published: publishedRef.current.value,
        }
        try {
            const url = `https://file-server.liara.run/api/update-post/${goalId}`;
            axios.post(url, formData, { headers: { auth_cookie: auth_cookie } })
                .then((d) => {
                    formData.published == "true"
                        ? toast.success("مقاله با موفقیت بروزرسانی شد.", {
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                        : toast.success("مقاله به صورت پیشنویس ذخیره شد.", {
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                })
                .catch((e) => {
                    let message = "متاسفانه ناموفق بود";
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
                    })
                })
        } catch (error) {
            console.log(error);
        }
    };

    const remover = () => {
        try {
            axios.post(`https://file-server.liara.run/api/delete-post/${goalId}`, { headers: { auth_cookie: auth_cookie } })
                .then(d => {
                    toast.success("مقاله با موفقیت حذف شد.", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {loading
                ? (<div className="flex justify-center items-center p-12">
                    <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                </div>)
                : (

                    <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-orange-500">جزئیات پست</h2>
                            <div className="flex justify-end items-center gap-4 text-white">
                                <Link target="_blank" href={`/blog/${fullData?.slug}`} className="bg-blue-600 px-4 py-1 rounded-md text-sm transition-all duration-500">لینک پست</Link>
                                <button onClick={() => remover()} className="bg-rose-600 cursor-pointer text-white px-4 py-1 rounded-sm text-xs">حذف</button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm">{fullData?._id ? fullData?._id : ""}</div>
                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm">{fullData?.createdAt ? fullData?.createdAt : ""}تاریخ ایجاد</div>
                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm">{fullData?.updatedAt ? fullData?.updatedAt : ""}به روز رسانی</div>
                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm">{fullData?.pageView ? fullData?.pageView : 0}بازدید</div>
                        </div>

                        <form onKeyDown={formKeyNotSuber} onSubmit={updater} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-6">
                                <div>عنوان مقاله</div>
                                <input defaultValue={fullData?.title ? fullData?.title : ""} required={true} ref={titleRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>اسلاگ پست</div>
                                <input defaultValue={fullData?.slug ? fullData?.slug : ""} required={true} ref={slugRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>آدرس عکس</div>
                                <input defaultValue={fullData?.image ? fullData?.image : ""} required={true} ref={imageRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>آلت عکس</div>
                                <input defaultValue={fullData?.imageAlt ? fullData?.imageAlt : ""} required={true} ref={imageAltRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>توضیحات کوتاه</div>
                                <input defaultValue={fullData?.shortDesc ? fullData?.shortDesc : ""} required={true} ref={shortDescRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>توضیحات بلند</div>
                                <textarea defaultValue={fullData?.longDesc ? fullData?.longDesc : ""} required={true} ref={longDescRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="tags flex flex-col gap-2">
                                <h3>برچسب ها</h3>
                                <div className="tags w-full flex flex-col gap-4">
                                    <div className="input flex gap-2 items-center">
                                        <input
                                            type="text"
                                            onKeyDown={tagSuber}
                                            ref={tagRef}
                                            className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
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
                                                        <span className="text-zinc-400 text-xs">
                                                            {t}
                                                        </span>
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
                                <div className="">مقالات مرتبط</div>
                                <div className="flex justify-start items-center flex-wrap gap-2">
                                    {loading
                                        ? (<div className="flex justify-center items-center p-12">
                                            <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                                        </div>)
                                        : posts && posts?.length < 1
                                            ? (<div>مقاله ای یافت نشد</div>)
                                            : posts && posts?.map((post, i) => (
                                                <div key={i} className="px-2 py-1 bg-zinc-200 rounded flex justify-center items-center gap-x-2">
                                                    <label htmlFor={post._id}>
                                                        {post.title}{" "}
                                                    </label>
                                                    {fullData?.relatedPosts &&
                                                        fullData?.relatedPosts.includes(post._id) ? (
                                                        <input
                                                            name={post._id}
                                                            id={post._id}
                                                            type="checkbox"
                                                            value={post._id}
                                                            onChange={postsRelatedManager}
                                                            defaultChecked
                                                        />
                                                    ) : (
                                                        <input
                                                            name={post._id}
                                                            id={post._id}
                                                            type="checkbox"
                                                            value={post._id}
                                                            onChange={postsRelatedManager}
                                                        />
                                                    )
                                                    }
                                                </div>
                                            ))
                                    }
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>منتشر شود</div>
                                <select ref={publishedRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400ب">
                                    {fullData?.published && fullData?.published == true ? (
                                        <>
                                            <option value="true">انتشار</option>
                                            <option value="false">پیشنویس</option>
                                        </>
                                        // ) : fullData?.published && fullData?.published == false ? (
                                    ) : fullData?.published == false ? (
                                        <>
                                            <option value="false">پیشنویس</option>
                                            <option value="true">انتشار</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="false">پیشنویس</option>
                                            <option value="true">انتشار</option>
                                        </>
                                    )}

                                </select>
                            </div>

                            <button type="submit" className="bg-indigo-600 text-white w-full py-2 cursor-pointer rounded-md transition-all duration-500 hover:bg-orange-500">ارسال</button>

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
                )}
        </>
    );
}

export default PostDetails;