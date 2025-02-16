import React from "react";
import { useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import { RootState } from "@/hooks/redux/store";

const Loader = () => {

    const isLoading = useSelector((state: RootState) => state.loader.isLoading);

    if (!isLoading) return null;
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
            <MoonLoader size={60} color={"#2980b9"} loading={true} />
            <p className="my-10">Loading...</p>
        </div>
    );
};

export default Loader;