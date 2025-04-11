import Image from "next/image";
import Link from "next/link";

type BannerPropsTypes = {
    id: string;
    image: string;
    imageAlt: string;
    link: string;
}

const getData = async (): Promise<BannerPropsTypes[]> => {
    const data = await fetch('https://file-server.liara.run/api/get-active-mid-bans', { cache: "no-store" });
    return data.json();
}

const MiddleBanners = async () => {
    const data = await getData();

    return (
        <section className="container mx-auto w-full flex justify-center xl:justify-between items-center flex-wrap px-4 lg:px-1">
            {!data || data.length === 0 && <div></div>}
            {data?.map((banner, i) => (
                <Link className="my-4" href={banner?.link} key={i}>
                    <Image
                        className="rounded-xl"
                        alt={banner?.imageAlt}
                        title={banner?.imageAlt}
                        width={600}
                        height={200}
                        sizes="auto"
                        src={banner?.image} />
                </Link>
            ))}
        </section>
    )
}

export default MiddleBanners;