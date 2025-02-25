import React, { FC, InputHTMLAttributes, useState } from "react";
import { useField } from "formik";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

interface ICustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  isOnboarding: boolean;
}

const CustomInput: FC<ICustomInputProps> = ({
  label,
  type,
  isOnboarding = true,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="w-full relative">
      <label
        className={`block text-sm font-medium mb-1.5 ${
          isOnboarding ? `text-[#fff]` : `text-[#000]`
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...field}
          {...props}
          type={isPassword && !showPassword ? "password" : "text"}
          className={`w-full border rounded-md p-3 pr-10 outline-none focus:ring-2 transition text-black
          ${
            meta.touched && meta.error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-[#5E17EB]"
          }`}
          {...(isPassword && {
            onCopy: (e) => e.preventDefault(),
            onPaste: (e) => e.preventDefault(),
            onCut: (e) => e.preventDefault(),
            autoComplete: "new-password",
          })}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        )}
      </div>
      {meta.touched && meta.error && (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default CustomInput;
