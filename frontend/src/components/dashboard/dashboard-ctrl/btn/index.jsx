"use client";
const DCBtn = ({ title, content, setcontentChanger, colorChanger, setColorChanger }) => {
    const goTopCtrl = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

  
    return (
        <div onClick={() => {
            setcontentChanger(content);
            setColorChanger(content);
            goTopCtrl();
        }}

            className={`${content == colorChanger
                ? "rounded-md w-40 h-12 flex justify-center items-center bg-indigo-600 cursor-pointer text-white transition-all duration-500 hover:bg-indigo-600"
                : "rounded-md w-40 h-12 flex justify-center items-center bg-orange-500 cursor-pointer text-white transition-all duration-500 hover:bg-indigo-600"

                }`}>
            {title}
        </div>
    );
}

export default DCBtn;