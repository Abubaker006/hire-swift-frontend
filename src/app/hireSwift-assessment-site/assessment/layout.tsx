"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import useAssessmentValidation from "@/hooks/customHooks/useAssessmentValidation";
import Cookies from "js-cookie";
import LogoImage from "../../../../public/assets/Logo/hire-swift-white.svg";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import LocationComponent from "@/components/LocationComponent/location";
import Loader from "@/utils/loader";

const AssessmentLayoutPage = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const tokenFromCookie = Cookies.get("assessmentValidationToken");

  const assessmentToken: string | null =
    tokenFromUrl ?? tokenFromCookie ?? null;

  console.log("Assessment Token:", {
    tokenFromUrl,
    tokenFromCookie,
    assessmentToken,
  });

  const validationResponse = useAssessmentValidation({ assessmentToken });
  if (!validationResponse) {
    return <Loader />;
  }
  const { isValidating } = validationResponse;

  if (isValidating) {
    return <Loader />;
  }

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 flex justify-between items-center bg-black text-white p-4 shadow-md">
        <div className="flex items-center gap-10">
          <Image src={LogoImage} alt="Logo" width={100} height={100} />
        </div>
        <div className="flex items-center gap-3">
          <div className="mr-5 flex flex-row  justify-between content-center">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="mr-1 text-gray-500"
            />
            <LocationComponent />
          </div>
        </div>
      </header>
      {children}
    </>
  );
};

export default AssessmentLayoutPage;
