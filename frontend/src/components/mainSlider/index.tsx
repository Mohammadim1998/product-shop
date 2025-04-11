import SliderDetails from "./sliderDetails";

type SliderPropsTypes = {
    _id: string;
    image: string;
    imageAlt: string;
    link: string;
}

const getData = async (): Promise<SliderPropsTypes[]> => {
    const data = await fetch('https://file-server.liara.run/api/get-active-sliders', { cache: 'no-store' });
    return data.json();
}

const MainSlider = async () => {
    const data = await getData();

    return (
        <div className="w-full z-30">
            <SliderDetails data={data} />
        </div>
    )
}

export default MainSlider;