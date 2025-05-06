"use client";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateTokens } from "@/apiServices/StripeAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "@/hooks/slices/loaderSlice";

const SuccessPage = () => {
  const params = useSearchParams();
  const amount = Number(params.get("amount"));
  const userId = params.get("userId");
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const apiRef = useRef<boolean>(false);

  const handleTokensUpdate = async () => {
    if (!amount || !userId) return;
    if (apiRef.current) return;
    try {
      apiRef.current = true;
      dispatch(showLoader());
      const response = await updateTokens(token, amount, userId);
      console.log("Tokens updated!");
      toast.success(response.message || "Tokens updated successully");
      window.location.href = "/dashboard"; //just a temp fix.
    } catch (error) {
      dispatch(hideLoader());
      apiRef.current = false;
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      router.replace("/dashboard");
    } finally {
      dispatch(hideLoader());
      apiRef.current = false;
    }
  };

  useEffect(() => {
    handleTokensUpdate();
  }, [amount, userId]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-lg">
        Your tokens have been updated. You can now continue using the platform,
        you will redirected shortly.
      </p>
    </div>
  );
};

export default SuccessPage;
