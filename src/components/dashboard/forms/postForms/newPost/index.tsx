"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

type Post = {
    _id: string;
    title: string;
};

type FormData = {
    title: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    image: string;
    imageAlt: string;
    shortDesc: string;
    longDesc: string;
    tags: string[];
    relatedPosts: string[];
    type: string;
    pageView: number;
    published: string;
    comments: string[];
};

const NewPost = () => {
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

    //Related Posts
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

    useEffect(() => {
        const url = "https://file-server.liara.run/api/posts-rel";
        axios.get(url, { headers: { auth_cookie: auth_cookie } })
            .then(d => setPosts(d.data))
            .catch(e => {
                setLoadingPosts(false);
            })
            .finally(() => {
                setLoadingPosts(false);
            })
    }, []);

    const [relPosts, setRelPosts] = useState<string[]>([]);
    const postsRelatedManager = (e: React.ChangeEvent<HTMLInputElement>) => {
        const postId = e.target.value;
        if (e.target.checked) {
            setRelPosts(prev => [...prev, postId]);
        } else {
            setRelPosts(prev => prev.filter(id => id !== postId));
        }
    };

    const submiter = (e: React.FormEvent) => {
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

        const formData: FormData = {
            title: titleRef.current.value,
            createdAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            slug: slugRef.current.value,
            image: imageRef.current.value,
            imageAlt: imageAltRef.current.value,
            shortDesc: shortDescRef.current.value,
            longDesc: longDescRef.current.value,
            tags: tag,
            relatedPosts: relPosts,
            type: "post",
            pageView: 0,
            published: publishedRef.current.value,
            comments: [],
        }

        const url = "https://file-server.liara.run/api/new-post";
        axios.post(url, formData, { headers: { auth_cookie: auth_cookie } })
            .then((d) => {
                formData.published == "true"
                    ? toast.success("مقاله با موفقیت دخیره شد.", {
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
    };

    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-orange-500">پست جدید</h2>
            <form onKeyDown={formKeyNotSuber} onSubmit={submiter} className="flex flex-col gap-6">

                <div className="flex flex-col gap-6">
                    <div>عنوان مقاله</div>
                    <input required={true} ref={titleRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                <div className="flex flex-col gap-6">
                    <div>اسلاگ پست</div>
                    <input required={true} ref={slugRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                <div className="flex flex-col gap-6">
                    <div>آدرس عکس</div>
                    <input required={true} ref={imageRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                <div className="flex flex-col gap-6">
                    <div>آلت عکس</div>
                    <input required={true} ref={imageAltRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                <div className="flex flex-col gap-6">
                    <div>توضیحات کوتاه</div>
                    <input required={true} ref={shortDescRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                <div className="flex flex-col gap-6">
                    <div>توضیحات بلند</div>
                    <textarea required={true} ref={longDescRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
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

                <div className="flex justify-start items-center flex-wrap gap-2">
                    <h3>مقالات مرتبط</h3>
                    {loadingPosts
                        ? (<div className="flex justify-center items-center p-12">
                            <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                        </div>)
                        : posts && posts?.length < 1
                            ? (<div>مقاله ای یافت نشد</div>)
                            : posts?.map((post, i) => (
                                <div key={i} className="px-2 py-1 bg-zinc-200 rounded flex justify-center items-center gap-x-2">
                                    {post.title}<input type="checkbox" value={post._id} onChange={postsRelatedManager} />
                                </div>
                            ))
                    }
                </div>

                <div className="flex flex-col gap-6">
                    <div>منتشر شود</div>
                    <select ref={publishedRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400ب">
                        <option value="true">انتشار</option>
                        <option value="false">پیشنویس</option>
                    </select>
                </div>

                <button type="submit" className="bg-indigo-600 text-white py-2 cursor-pointer w-full rounded-md transition-all duration-500 hover:bg-orange-500">ارسال</button>
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
}

export default NewPost;