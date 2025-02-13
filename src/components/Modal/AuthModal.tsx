import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  type: "login" | "signup";
  onSubmit: () => void;
  changeModalType: () => void;
}
const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  type,
  onSubmit,
  changeModalType,
}) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().when("$isSignIn", {
      is: true,
      then: (schema) =>
        schema
          .min(8, "Password must be at least 8 characters long")
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain a special character"
          )
          .required("Password is required"),
      otherwise: (schema) => schema.required("Password is required"),
    }),
    ...(type === "signup" && {
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      role: Yup.string().required("Role is required"),
      contactNumber: Yup.string()
        .matches(/^\d{10,15}$/, "Invalid contact number")
        .required("Contact number is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
      address: Yup.string().required("Address is required"),
      gender: Yup.string().required("Gender is required"),
      education: Yup.string().required("Education is required"),
      country: Yup.string().required("Country is required"),
    }),
  });

  const formik = useFormik({
    initialValues:
      type === "signup"
        ? {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            role: "",
            contactNumber: "",
            confirmPassword: "",
            address: "",
            gender: "",
            education: "",
            country: "",
          }
        : {
            email: "",
            password: "",
          },
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        onCancel={onClose}
        footer={null}
        centered
        styles={{
          body: {
            //will provide style later.
          },
        }}
      >
          {type === "login" ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Login to your account
              </h1>
              <Form
                layout="vertical"
                onFinish={formik.handleSubmit}
                className="w-full"
              >
                <Form.Item
                  label={<span className="text-gray-700">Email</span>}
                  validateStatus={
                    formik.touched.email && formik.errors.email ? "error" : ""
                  }
                  help={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : ""
                  }
                >
                  <Input
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} // Mark field as touched
                    value={formik.values.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-gray-700">Password</span>}
                  validateStatus={
                    formik.touched.password && formik.errors.password
                      ? "error"
                      : ""
                  }
                  help={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : ""
                  }
                >
                  <Input.Password
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} // Mark field as touched
                    value={formik.values.password}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  Login
                </Button>
              </Form>
              <button
                onClick={changeModalType}
                className="text-blue-600 hover:underline"
              >
                Don&apos;t have an account? Sign up
              </button>
            </div>
          ) : (
            <>Sign Up code</>
          )}
      </Modal>
    </>
  );
};

export default AuthModal;
