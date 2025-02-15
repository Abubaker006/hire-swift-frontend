import nextConfig from "../../next.config";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const AUTH_API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";

export const loginAPI = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || "Login failed");
    }
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};

export const signupAPI = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactNumber: string;
  role: string;
}) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/auth/signup`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (response.status !== 201) {
      toast.error("An error occured, Please try again");
      throw new Error(response.data.message || "Signup failed");
    }
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error at signup api", error);
    throw error;
  }
};

export const logoutAPI = async () => {
  try {
    const response = await axios.get(`${AUTH_API_URL}/auth/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      toast.error("Error loggin out");
      throw new Error("Error occured while logging out");
    }

    return response.data;
  } catch (error) {
    console.error("Error at logging out api", error);
    throw error;
  }
};

export const getUserAPI = async () => {
  try {
    const response = await axios.get(`${AUTH_API_URL}/auth/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || "User information fetch failed");
    }
    return response.data;
  } catch (error) {
    console.error("getUserAPI Error:", error);
    throw error;
  }
};
