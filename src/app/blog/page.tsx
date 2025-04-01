import BlogComp from "@/components/blogComp";

interface BlogProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>
}

const Blog = async ({ searchParams }: BlogProps) => {
    const params = await searchParams;

    return (
        <div>
            <BlogComp url={params} />
        </div>
    );
}

export default Blog;