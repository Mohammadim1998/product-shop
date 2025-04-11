"use client";
import DashboardCtrl from "@/components/dashboard/dashboard-ctrl";
import { useEffect, useState } from "react";
import MiddleBannerAll from "../forms/middleBannerForms";
import SlidersAll from "../forms/SliderForms";
import PostForms from "../forms/postForms"
import CategoryForms from "../forms/categoryForms"
import ProductForms from "../forms/ProductForms"
import UserForms from "../forms/userForms"
import PaymentForms from "../forms/PaymentForms"
import CommentForms from "../forms/CommentForms"
import AdminPannel from "../forms/Admin-pannel"

const MainDashboard = () => {
    const [contentChanger, setcontentChanger] = useState("counter");
    const [details, setDetails] = useState();

    useEffect(() => {
        if (contentChanger === "counter") {
            setDetails(<AdminPannel />);
        } else if (contentChanger === "midBan") {
            setDetails(<MiddleBannerAll />);
        } else if (contentChanger === "sliders") {
            setDetails(<SlidersAll />);
        } else if (contentChanger === "posts") {
            setDetails(<PostForms />);
        } else if (contentChanger === "categories") {
            setDetails(<CategoryForms />);
        } else if (contentChanger === "products") {
            setDetails(<ProductForms />);
        } else if (contentChanger === "users") {
            setDetails(<UserForms />);
        } else if (contentChanger === "payments") {
            setDetails(<PaymentForms />);
        } else if (contentChanger === "comments") {
            setDetails(<CommentForms />);
        }
    }, [contentChanger]);

    return (
        <div className="container mx-auto flex justify-between items-start gap-4">
            <DashboardCtrl setcontentChanger={setcontentChanger} />

            <div className="w-full">{details}</div>
        </div>
    );
}

export default MainDashboard;