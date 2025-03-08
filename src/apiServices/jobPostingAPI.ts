import nextConfig from "../../next.config";
import axios from "axios";
const API_URL = nextConfig.env?.NEXT_PUBLIC_API_URL ?? "";

export interface JobPostings {
  _id: string;
  title: string;
  jobType: string;
  locationType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
interface Compensation {
  min: number;
  max: number;
  type: string;
}

export interface JobPosting {
  _id: string;
  recruiterId: string;
  title: string;
  jobType: string;
  locationType: string;
  locationDetails: string;
  team: string;
  description: string;
  requiredQualification: string;
  prefferedQualification: string;
  techStack: string[];
  applicationDeadLine: string;
  startDate: string;
  duration: string;
  diversityStatement: string;
  contactEmail: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  compensation: Compensation;
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
  token: string | null
): Promise<ApiResponse<JobPosting>> => {
  const response = await axios.post(
    `${API_URL}/v1/recruiter/job-postings`,
    jobData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getAllJobPostings = async (
  token: string | null,
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<JobPostings[]> => {
  const response = await axios.get<ApiResponse<JobPostings[]>>(
    `${API_URL}/v1/recruiter/job-postings`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { status, page, limit },
    }
  );
  return response.data.data.map((post) => ({
    _id: post._id,
    title: post.title,
    jobType: post.jobType,
    locationType: post.locationType || "",
    status: post.status,
    createdAt: new Date(post.createdAt).toLocaleDateString(),
    updatedAt: new Date(post.updatedAt).toLocaleDateString(),
  }));
};

export const getJobPost = async (
  id: string,
  token: string | null
): Promise<ApiResponse<JobPosting>> => {
  const response = await axios.get(
    `${API_URL}/v1/recruiter/job-postings/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

export const updateJobPosting = async (
  id: string,
  jobData: Partial<CreateJobPostingRequest>,
  token: string | null
): Promise<ApiResponse<JobPosting>> => {
  const response = await axios.put(`${API_URL}/v1/recruiter/job-postings/${id}`, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteJobPosting = async (
  id: string,
  token: string | null
): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/v1/recruiter/job-postings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
