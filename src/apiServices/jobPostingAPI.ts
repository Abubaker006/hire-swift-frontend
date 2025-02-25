import nextConfig from "../../next.config";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";

interface JobPosting {
  id: string;
  title: string;
  jobType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateJobPostingRequest {
  title: string;
  jobType: string;
  status: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export const createJobPosting = async (
  jobData: CreateJobPostingRequest,
  token: string
): Promise<ApiResponse<JobPosting>> => {
  const response = await axios.post(API_URL, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllJobPostings = async (
  token: string,
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<JobPosting[]>> => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { status, page, limit },
  });
  return response.data;
};

export const getJobPost = async (
  id: string,
  token: string
): Promise<ApiResponse<JobPosting>> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateJobPosting = async (
  id: string,
  jobData: Partial<CreateJobPostingRequest>,
  token: string
): Promise<ApiResponse<JobPosting>> => {
  const response = await axios.put(`${API_URL}/${id}`, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteJobPosting = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
