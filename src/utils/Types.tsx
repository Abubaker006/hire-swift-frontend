export interface AssessmentValidatedData {
  isLoading: boolean;
  isValid: boolean;
  message: string;
  assessmentData: AssessmentData | null;
  status: string;
  scheduledDateTime: string | null;
  token?: string | null;
  error: string | null;
}

export interface UseAssessmentValidationResponse {
  data: AssessmentValidatedData | null;
  isValidating: boolean;
}

export interface AssessmentData {
  scheduled: boolean;
  taken: boolean;
  passed?: boolean;
  overallScore: number | null;
}

export interface BaseValidationResponse {
  message: string;
  canStart: boolean;
  scheduledDateTime: string;
  status: string;
  assessment: AssessmentData;
  questions?: Question[];
  totalTime?: number | null;
}

export interface ErrorResponse {
  message: string;
}

export type ValidationResponse = BaseValidationResponse;

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "coding" | "asr";
  difficulty: string;
  classification: string;
  timeLimit: number;
  index: number;
}

export interface StartAssessmentSuccessResponse {
  message: string;
  canStart: boolean;
  scheduledDateTime: string;
  questions: AssessmentQuestion[] | null;
  totalTime: number | null;
  token: string | null;
  status: string;
  assessment: AssessmentData;
}

export type StartAssessmentResponse = StartAssessmentSuccessResponse;

export interface Question {
  id: string;
  question: string;
  type: "coding" | "asr";
  difficulty: string;
  classification: string;
  timeLimit: number;
  index: number;
}

export interface QuestionRendererProps {
  question: Question;
  onNext: () => void;
  assessmentTime: number | null;
}

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
  numberOfCandidatesRequired: number;
}

export interface CreateJobPostingRequest {
  title: string;
  jobType: string;
  status: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApplyJobResponse {
  message: string;
  tokensRemaining: number;
  applicationId: string;
  assessmentDateTime: string;
}

export interface CandidateJobData {
  _id: string;
  title: string;
  jobType: string;
  locationType: string;
  locationDetails: string;
  team: string;
  description: string;
  techStack: string[];
  duration: string;
  createdAt: string;
  compensation: Compensation;
  requiredQualification: string;
  prefferedQualification: string;
  applicationDeadLine: string;
  startDate: string;
  contactEmail: string;
  numberOfSubmittedApplications: number;
}

export interface JobPostingsResponse {
  data: CandidateJobData[];
  total: number;
  page: number;
  limit: number;
}

interface Assessment {
  scheduled: boolean;
  scheduledDateTime: string | Date;
  assessmentCode: string;
  assessmentLink: string;
  taken: boolean;
  isStarted: boolean;
  quesiton: AssessmentQuestion;
}

interface Interview {
  scheduled: boolean;
  completed: boolean;
}
interface Offer {
  offered: boolean;
  accepted: boolean;
}
interface Compensation {
  min: number;
  max: number;
  type: string;
}

export interface JobDetails {
  _id: string;
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
  contactEmail: string;
  createdAt: string;
  compensation: Compensation;
}
export interface Application {
  _id: string;
  userId: string;
  jobId: JobDetails;
  assessment: Assessment;
  interview: Interview;
  offer: Offer;
  status: string;
  appliedAt: string;
  updatedAt: string;
  __v: number;
}
export interface ApplicationsResponse {
  applications: Application[];
}

interface Candidate {
  id: string;
  name?: string;
  email?: string;
}

interface Job {
  id: string;
  title: string;
}

interface AssessmentParameters {
  concept: number;
  clarity: number;
  accuracy: number;
  knowledge: number;
  codeQuality: number;
  problemSolving: number;
}

interface AssessmentObservation {
  summary: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  nextSteps: string;
  codeQualityFeedback: string;
  problemSolvingFeedback: string;
}

interface Assessment {
  assessmentCode: string;
  totalScore: number;
  parameters: AssessmentParameters;
  observation: AssessmentObservation;
}

export interface AssessmentReportBase {
  job: Job;
  assessment: Assessment;
  candidate: Candidate;
}
export interface AdminAssessmentReport extends AssessmentReportBase {
  rank: number;
}

export interface EvaluatedAssessmentAPIResponse {
  success: boolean;
  message: string;
  data?: AssessmentReportBase[];
}

export interface EvaluatedAssessmentAPIResponseAdmin {
  success: boolean;
  message: string;
  data?: AdminAssessmentReport[];
}

export type AdminAssessmentResponse = EvaluatedAssessmentAPIResponseAdmin;
export type CandidateAssessmentResponse = EvaluatedAssessmentAPIResponse;

export interface StartAssessmentEvaluationResponse {
  sucess: boolean;
  message: string;
}
