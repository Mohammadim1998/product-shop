import Categories from "@/components/categories";
import MainSlider from "@/components/mainSlider";
import MiddleBanners from "@/components/middle-banners";
import NewBlog from "@/components/newBlogs";
import ProductsSlider from "@/components/productsSlider";

type CategiriesPropsTypes = {
  slug: string;
  title: string;
  // _id: string;
}

export type ProductsPropsTypes = {
  _id: string;
  buyNumber: number;
  categories: CategiriesPropsTypes[];
  comments: string[];
  createdAt: string;
  features: string[];
  image: string;
  imageAlt: string;
  longDesc: string;
  pageView: number;
  price: string;
  published: boolean;
  relatedProducts: string[];
  shortDesc: string;
  slug: string;
  tags: string[];
  title: string;
  typeOfProduct: string;
  updatedAt: string;
}

const getData = async ():Promise<ProductsPropsTypes[]> => {
  // const data = await fetch("https://file-server.liara.run/api/get-new-products", { cache: "no-store" });
  const data = await fetch("https://file-server.liara.run/api/products", { cache: "no-store" });
  return data.json();
}

export default async function Home() {
  const data = await getData();  

  return (
    <div className="w-full flex flex-col gap-12 mt-8 md:mt-0">
      <MainSlider />
      <ProductsSlider goalData={data} title="اپلیکیشن ها" linkComp="app" />
      <MiddleBanners />
      <Categories />
      <NewBlog />
    </div>
  );
}