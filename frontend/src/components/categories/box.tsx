import Image from "next/image";
import Link from "next/link";
import { CategoriesPropsTypes } from ".";

type ItemCategiry = {
    data: CategoriesPropsTypes
}

const CatBox: React.FC<ItemCategiry> = ({ data }) => {
    return (
        <Link
            href={`/shop?&maxP=1000000000&minP=0&categories=${data?.slug}&pgn=12&pn=1`}
            className="flex justify-between items-center bg-slate-200 transition-all duration-300 hover:bg-orange-400 rounded-lg p-3 w-72">
            <div className="flex flex-col gap-2">
                <h3 className="text-black">{data?.title}</h3>
                <p className="text-base sm:text-sm">{data?.shortDesc}</p>
            </div>
            <div className="w-16">
                <Image
                    width={60}
                    height={60}
                    src={data?.image}
                    alt={data?.imageAlt}
                    title={data?.imageAlt}
                    priority={true}
                />
            </div>
        </Link>
    );
}

export default CatBox;