import nextConfig from "../../next.config";
import axios from "axios";
const API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";
import {
  CreateJobPostingRequest,
  JobPosting,
  ApiResponse,
  JobPostings,
  ApplyJobResponse,
  JobPostingsResponse,
  ApplicationsResponse,
} from "@/utils/Types";

export const createJobPosting = async (
  jobData: CreateJobPostingRequest,
  token: string | null
): Promise<ApiResponse<JobPosting>> => {
  try {
    const response = await axios.post(
      `${API_URL}/v1/recruiter/job-postings`,
      jobData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getAllJobPostings = async (
  token: string | null,
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<JobPostings[]> => {
  try {
    const response = await axios.get<ApiResponse<JobPostings[]>>(
      `${API_URL}/v1/recruiter/job-postings`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { status, page, limit },
      }
    );
    return response.data.data.map((post) => ({
      _id: post._id,
      title:
        post.title.charAt(0).toUpperCase() + post.title.slice(1).toLowerCase(),
      jobType:
        post.jobType.charAt(0).toUpperCase() +
        post.jobType.slice(1).toLowerCase(),
      locationType:
        post.locationType.charAt(0).toUpperCase() +
          post.locationType.slice(1).toLowerCase() || "",
      status:
        post.status.charAt(0).toUpperCase() +
        post.status.slice(1).toLowerCase(),
      createdAt: new Date(post.createdAt).toLocaleDateString(),
      updatedAt: new Date(post.updatedAt).toLocaleDateString(),
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getJobPost = async (
  id: string,
  token: string | null
): Promise<ApiResponse<JobPosting>> => {
  try {
    const response = await axios.get(
      `${API_URL}/v1/recruiter/job-postings/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateJobPosting = async (
  id: string,
  jobData: Partial<CreateJobPostingRequest>,
  token: string | null
): Promise<ApiResponse<JobPosting>> => {
  try {
    const response = await axios.put(
      `${API_URL}/v1/recruiter/job-postings/${id}`,
      jobData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteJobPosting = async (
  id: string,
  token: string | null
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(
      `${API_URL}/v1/recruiter/job-postings/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateJobPostingStatus = async (
  id: string,
  status: string,
  token: string | null
): Promise<{
  id: string;
  status: string;
  updatedAt: string;
  message: string;
}> => {
  try {
    const response = await axios.patch(
      `${API_URL}/v1/recruiter/job-postings/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const applyForJobPosting = async (
  id: string,
  token: string | null
): Promise<ApplyJobResponse> => {
  try {
    const response = await axios.post<ApplyJobResponse>(
      `${API_URL}/v1/candidate/job-postings/${id}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getAllCandidateJobPostings = async (
  token: string | null
): Promise<JobPostingsResponse> => {
  try {
    const response = await axios.get<JobPostingsResponse>(
      `${API_URL}/v1/candidate/job-postings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getMyApplications = async (
  token: string | null
): Promise<ApplicationsResponse> => {
  try {
    const response = await axios.get<ApplicationsResponse>(
      `${API_URL}/v1/candidate/job-applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
