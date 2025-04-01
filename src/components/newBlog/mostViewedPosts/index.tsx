"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type MostViewdPropsTypes = {
    slug: string;
    title: string;
}

const MostViewedposts = () => {
    const [posts, setPosts] = useState<MostViewdPropsTypes[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get("https://file-server.liara.run/api/get-most-viewed-posts")
            .then(d => {
                setPosts(d.data);
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])

    return (
        <div className="flex flex-col gap-4 rounded-lg p-3 shadow-[0px_0px_8px_rgba(0,0,0,0.35)]">
            <h3 className="text-blue-500">پربازدیدترین مقالات</h3>
            <ul className="flex flex-col gap-3">
                {loading
                    ? (
                        <div className="flex justify-center items-center p-12">
                            <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                        </div>
                    ) : posts && posts?.length < 1
                        ? (<div></div>)
                        : (posts && posts?.map((post, i) => (
                            <li key={i}>
                                <Link href={`/blog/${post.slug}`} className="p-2 flex justify-start items-center text-base sm:text-sm border-r-2 border-zinc-600">{post.title}</Link>
                            </li>
                        )))
                }
            </ul>
        </div>
    );
}

export default MostViewedposts;