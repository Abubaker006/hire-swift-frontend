import React from "react";
import { useSelector } from "react-redux";
import LoaderImage from "../../public/assets/loader/hire swift .gif";
import { RootState } from "@/hooks/redux/store";
import Image from "next/image";
const Loader = () => {

    const isLoading = useSelector((state: RootState) => state.loader.isLoading);

    if (!isLoading) return null;
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
             <Image src={LoaderImage} alt="Logo" width={100} height={100} />
             <p>Loading</p>
        </div>
    );
};

export default Loader;