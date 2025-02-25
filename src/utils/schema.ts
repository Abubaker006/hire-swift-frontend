import * as Yup from "yup";

export const loginPageValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const signUpPageValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain a special character"
    )
    .required("Password is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  role: Yup.string().required("Role is required"),
  contactNumber: Yup.string()
    .matches(/^\d{10,15}$/, "Invalid contact number")
    .required("Contact number is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const JobPostFormValidationSchema = Yup.object().shape({
  title: Yup.string().required("Job title is requuired"),
  jobType: Yup.string()
    .oneOf(
      ["internship", "full-time", "part-time", "contract", "temporary"],
      "Invalid Job type"
    )
    .required("Job type is required"),
  locationType: Yup.string().oneOf(
    ["remote", "onsite", "hybrid"],
    "Invalid location type"
  ),
  locationDetails: Yup.string().nullable(),
  team: Yup.string().nullable(),
  description: Yup.string().required("Job description is required"),
  requiredQualification: Yup.string().required(
    "Required qualification is required"
  ),
  prefferedQualification: Yup.string().required(
    "Preffered qualification required"
  ),
  techStack: Yup.string().required("Tech stack is required"),
  compensationMin: Yup.number()
    .nullable()
    .min(0, "Minimum compenstaion cannot be negative"),
  compensationMax: Yup.number()
    .nullable()
    .min(
      Yup.ref("compensationMin"),
      "Maximum compensation must be greater than minimum"
    ),
  compensationType: Yup.string()
    .oneOf(["hourly", "salary", "DOE"], "Invalid compensation type")
    .nullable(),
  applicationDeadLine: Yup.date().nullable(),
  startDate: Yup.date().nullable(),
  duration: Yup.string().nullable(),
  diversityStatement: Yup.string().nullable(),
  contactEmail: Yup.string().email("Invalid email").nullable(),
});
