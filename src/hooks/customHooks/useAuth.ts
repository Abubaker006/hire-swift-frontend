"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { getUserAPI } from "@/apiServices/authAPI";
import { loginSuccess } from "../slices/authSlice";
import { toast } from "react-toastify";

interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

const useAuth = (allowedRoles: string[]) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        Cookies.remove("access_token");
        router.replace("/login");
        return;
      }

      const getUserData = async () => {
        try {
          const response = await getUserAPI();
          if (!response || !response.user) {
            toast.error("Error fetching user information");
            Cookies.remove("access_token");
            router.replace("/login");
            return;
          }
          if (response.user.role !== decodedToken.role) {
            toast.error("Unauthorized Access, please log in again");
            Cookies.remove("access_token");
            router.replace("/login");
            return;
          }

          if (!allowedRoles.includes(response.user.role)) {
            router.replace("/unauthorized");
            return;
          }

          dispatch(
            loginSuccess({
              user: response.user,
              token: Cookies.get("access_token"),
            })
          );
          setRole(response.user.token || decodedToken.role);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error fetching user information");
          Cookies.remove("access_token");
          router.replace("/login");
        } finally {
          setIsChecking(false);
        }
      };

      if (allowedRoles.includes(decodedToken.role)) {
        getUserData();
        setIsChecking(false);
      } else {
        router.replace("/unauthorized");
        return;
      }
    } catch (error) {
      console.error("Invalid Token, Please login again", error);
      Cookies.remove("access_token");
      router.replace("/login");
    }
  }, [allowedRoles, router, dispatch]);

  return { isChecking, role };
};

export default useAuth;
