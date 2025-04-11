import CatBox from "./box";

export type CategoriesPropsTypes = {
    _id: string;
    image: string;
    imageAlt: string;
    shortDesc: string;
    slug: string;
    title: string;
    typeOfProduct: string;
}

const getData = async (): Promise<CategoriesPropsTypes[]> => {
    const data = await fetch('https://file-server.liara.run/api/get-active-categories', { cache: 'no-store' });
    return data.json();
}

const Categories = async () => {
    const data = await getData();

    return (
        <>
            {data.length < 1 && <div></div>}
            <section className="container mx-auto flex justify-center sm:justify-between items-center flex-wrap gap-2 mt-4">
                {data?.map((item, i) => (
                    <CatBox key={i} data={item} />
                ))}
            </section>
        </>
    )
}

export default Categories;