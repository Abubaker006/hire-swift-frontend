"use client";
import React, { Suspense } from "react";
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

  return (
    <Suspense fallback={<Loader />}>
      <AssessmentContent assessmentToken={assessmentToken}>
        <Loader />
        {children}
      </AssessmentContent>
    </Suspense>
  );
};

const AssessmentContent = ({
  assessmentToken,
  children,
}: {
  assessmentToken: string | null;
  children: React.ReactNode;
}) => {
  const validationResponse = useAssessmentValidation({ assessmentToken });

  if (!validationResponse || validationResponse.isValidating) {
    return <Loader />;
  }

  const { data, isValidating } = validationResponse;
  if (!data || isValidating) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 flex justify-between items-center bg-black text-white p-4 shadow-md">
        <div className="flex items-center gap-10">
          <Image src={LogoImage} alt="Logo" width={100} height={100} />
        </div>
        <div className="flex items-center gap-3">
          <div className="mr-5 flex flex-row justify-between content-center">
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
