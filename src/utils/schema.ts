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
    .required("Confirm password is required")
});
