import Breadcrump from "@/components/breadCrumb";
import RelatedPosts from "@/components/shopComp/relatedPost";
import Image from "next/image";
import { FaRegEye } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import Link from "next/link";
import { IoSendOutline } from "react-icons/io5";
import MostViewedposts from "@/components/newBlog/mostViewedPosts";
import SearchBlog from "@/components/newBlog/searchBlog";
import CommentManager from "@/components/commentManager";
import ProductPostCommentNum from "@/components/shopComp/productPost-ShopCommentNum/productPostCommentNum";

type BlogPost = {
    _id: string;
    title: string;
    slug: string;
    image: string;
    imageAlt: string;
    shortDesc: string;
    longDesc: string;
    pageView: number;
    updatedAt: string;
    tags: string[];
    relatedPosts: string[];
    msg?: string;
};

type CommentProps = {
    src_id: string;
    typeOfModel: string;
};

type Params = {
    slug: string;
}

const getData = async (slug: string): Promise<BlogPost> => {
    const data = await fetch(`https://file-server.liara.run/api/get-post/${slug}`, { cache: "no-store" });
    return data.json();
}

const SingleBlog = async ({ params }: { params: Params }) => {
    const data = await getData(params.slug);
    const commentProps = { src_id: data._id, typeOfModel: "post" };

    //FOR SEO
    const postSlug = `http://localhost:3000/blog${data.slug}`;
    const postShortDesc = data.shortDesc;

    return (
        <div className="flex justify-between items-start container mx-auto gap-2">
            {data.msg
                ? (
                    <div>
                        <>
                            <title>{data.title}</title>
                            <meta name="description" content={"انتشار بزودی..."} />
                            <meta name="robots" content="index, follow" />
                            <link rel="canonical" href={postSlug} />
                        </>
                        <div>مقاله هنوز منتشر نشده است...</div>
                    </div>
                )
                : (
                    <div className="w-full flex items-start justify-between gap-2 flex-wrap lg:flex-nowrap my-8 px-1 md:p-0">
                        <>
                            <title>{data.title}</title>
                            <meta name="description" content={postShortDesc} />
                            <meta name="robots" content="index, follow" />
                            <link rel="canonical" href={postSlug} />
                        </>

                        <main className="w-full md:w-[60%] lg:w-[75%]">
                            <div className="flex flex-col gap-12">
                                <Breadcrump
                                    secondTitle={"وبلاگ"}
                                    secondLink={"/blog"}
                                    title={data.title}
                                />

                                <section className="flex justify-center items-center">
                                    <Image
                                        className="rounded-xl"
                                        width={800}
                                        height={400}
                                        alt={data?.imageAlt}
                                        title={data?.imageAlt}
                                        src={data?.image}
                                        priority={true}
                                    />
                                </section>

                                <section className="flex flex-col gap-6">
                                    <h1 className="text-blue-400 text-lg">
                                        {data.title}
                                    </h1>

                                    <div className="flex justify-start items-center gap-4 text-base sm:text-sm flex-wrap">
                                        <div className="bg-zinc-100 rounded-md p-2 flex justify-between items-center gap-2">
                                            <FaRegEye className="w-6 h-6 text-black" />
                                            <span>تعداد بازدید: </span>
                                            <span>{data.pageView}</span>
                                        </div>

                                        <ProductPostCommentNum goalId={data._id} />

                                        <div className="bg-zinc-100 rounded-md p-2 flex justify-between items-center gap-2">
                                            <SlCalender className="w-6 h-6 text-black" />
                                            <span>آخرین بروزرسانی: </span>
                                            <span>{data.updatedAt}</span>
                                        </div>
                                    </div>
                                </section>

                                <section className="flex flex-col gap-6">
                                    <h2 className="text-xl">توضیحات کامل</h2>
                                    <p className="leading-9 text-justify">{data.longDesc}</p>
                                </section>

                                <section className="">
                                    <RelatedPosts typeOfModel={"post"} relPostsData={data.relatedPosts} title={"مقالات مرتبط"} />
                                </section>

                                <CommentManager commentProps={commentProps} />

                            </div>
                        </main>

                        <aside className="mt-8 md:mt-0 lg:w-80 max-w-80 rounded-md flex flex-col gap-12">
                            <div className="flex justify-center">
                                <SearchBlog />
                            </div>

                            <div className="flex flex-col gap-4 rounded-lg p-3 shadow-[0px_0px_8px_rgba(0,0,0,0.35)]">
                                <h3 className="text-blue-500">توضیحات خلاصه</h3>
                                <p className="leading-8 text-base sm:text-sm text-justify">{data.shortDesc}</p>
                            </div>

                            <div className="flex flex-col gap-4 rounded-lg p-3 shadow-[0px_0px_8px_rgba(0,0,0,0.35)]">
                                <h3 className="text-blue-500">دسته بندی ها</h3>
                                <div className="flex justify-start items-center gap-2 flex-wrap">
                                    <Link href={"/"}
                                        className="p-2 flex justify-center items-center rounded-md hover:text-white text-base sm:text-sm bg-zinc-200 transition-all duration-500 hover:bg-orange-500">
                                        دسته 1
                                    </Link>
                                    <Link href={"/"}
                                        className="p-2 flex justify-center items-center rounded-md hover:text-white text-base sm:text-sm bg-zinc-200 transition-all duration-500 hover:bg-orange-500">
                                        دسته 1
                                    </Link>
                                    <Link href={"/"}
                                        className="p-2 flex justify-center items-center rounded-md hover:text-white text-base sm:text-sm bg-zinc-200 transition-all duration-500 hover:bg-orange-500">
                                        دسته 1
                                    </Link>
                                    <Link href={"/"}
                                        className="p-2 flex justify-center items-center rounded-md hover:text-white text-base sm:text-sm bg-zinc-200 transition-all duration-500 hover:bg-orange-500">
                                        دسته 1
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 rounded-lg p-3 shadow-[0px_0px_8px_rgba(0,0,0,0.35)]">
                                <h3 className="text-blue-500">برچسب ها</h3>
                                <div className="flex justify-start items-center gap-2 flex-wrap">
                                    {data.tags.length < 1 ? (
                                        <div className="flex justify-center items-center p-3">بدون برچسب</div>
                                    ) : (data.tags.map((tag, i) => (
                                        <Link key={i} href={`/blog?keyword=${tag}`}
                                            className="p-2 flex justify-center items-center rounded-md hover:text-white text-base sm:text-sm bg-zinc-200 transition-all duration-500 hover:bg-orange-500">
                                            #{tag}
                                        </Link>
                                    )))}
                                </div>
                            </div>

                            <MostViewedposts />

                            <div className="flex flex-col gap-4 rounded-lg p-3 shadow-[0px_0px_8px_rgba(0,0,0,0.35)]">
                                <h3 className="text-blue-500">پرفروشترین محصولات</h3>
                                <ul className="flex flex-col gap-3">
                                    <li>
                                        <Link href={"/"} className="p-2 flex justify-center items-center text-base sm:text-sm border-r-2 border-zinc-600"> مقاله تستی اول مقاله تستی اول مقاله تستی اول</Link>
                                    </li>
                                    <li>
                                        <Link href={"/"} className="p-2 flex justify-center items-center text-base sm:text-sm border-r-2 border-zinc-600"> مقاله تستی اول مقاله تستی اول مقاله تستی اول</Link>
                                    </li>
                                    <li>
                                        <Link href={"/"} className="p-2 flex justify-center items-center text-base sm:text-sm border-r-2 border-zinc-600"> مقاله تستی اول مقاله تستی اول مقاله تستی اول</Link>
                                    </li>
                                    <li>
                                        <Link href={"/"} className="p-2 flex justify-center items-center text-base sm:text-sm border-r-2 border-zinc-600"> مقاله تستی اول مقاله تستی اول مقاله تستی اول</Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-4 rounded-lg p-3 shadow-[0px_0px_8px_rgba(0,0,0,0.35)]">
                                <h3 className="text-blue-500">شرکت در خبرنامه</h3>
                                <form className="border-zinc-700 border-2 px-2 rounded-md flex justify-between items-center">
                                    <input type="text" className="bg-transparent p-2 outline-none text-sm" placeholder="ایمیل خبرنامه را وارد کنید..." />
                                    <IoSendOutline className="w-6 h-6" />
                                </form>
                            </div>

                        </aside>
                    </div>
                )}
        </div>
    );
}

export default SingleBlog;