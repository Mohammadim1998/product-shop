import Categories from "@/components/categories";
import MainSlider from "@/components/mainSlider";
import MiddleBanners from "@/components/middle-banners";
import NewBlog from "@/components/newBlogs";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-12 mt-8 md:mt-0">
      <MainSlider />
      <MiddleBanners />
      <Categories />
      <NewBlog />
    </div>
  );
}