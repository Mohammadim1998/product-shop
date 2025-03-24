import BlogBox from "./box";

export type NewBlogsPropsTypes = {
    _id: string;
    image: string;
    imageAlt: string;
    pageView: number;
    shortDesc: string;
    slug: string;
    title: string;
    type: string;
    updatedAt: string;
}

const getData = async (): Promise<NewBlogsPropsTypes[]> => {
    const data = await fetch('https://file-server.liara.run/api/get-new-posts');
    return data.json();
}

const NewBlog = async () => {
    const data = await getData();

    return (
        <>
            {data.length < 1 ? (
                <div></div>
            ) : (
                <section className=" flex flex-col gap-[1.5rem] container mx-auto ">
                    <header className=" flex justify-between items-center ">
                        <h2 className="  text-2xl border-r-zinc-700 border-r-2 pr-1 ">
                            آخرین مقالات
                        </h2>
                    </header>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        {data.map((bl, i) => (
                            <BlogBox data={bl} key={i} />
                        ))}
                    </div>
                </section>
            )}
        </>
    )
}

export default NewBlog;