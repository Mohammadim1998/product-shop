import ShopComp from "@/components/shopComp";

interface PageProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>
}

const page = async ({ searchParams }: PageProps) => {
    const params = await searchParams;

    return (
        <div>
            <>
                <title>فروشگاه</title>
                <meta name="description" content={"فروشگاه"} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={"http://localhost:3000/shop"} />
            </>

            <ShopComp url={params} />
        </div>
    );
}

export default page;