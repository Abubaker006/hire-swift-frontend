import React, { FC, SelectHTMLAttributes } from "react";
import { useField } from "formik";

interface ICustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  isOnboarding: boolean;
}

const CustomSelect: FC<ICustomSelectProps> = ({
  label,
  isOnboarding = true,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col w-full">
      <label
        className={`block text-sm font-medium mb-1.5 ${
          isOnboarding ? `text-[#fff]` : `text-[#000]`
        }`}
        htmlFor={props.id || props.name}
      >
        {label}
      </label>
      <select
        {...field}
        {...props}
        className={`w-full max-w-lg px-4 py-3.5 bg-white text-black rounded-lg border border-gray-300 
         focus:outline-none focus:ring-2 focus:focus:ring-[#5E17EB] transition-all duration-200 ${
           meta.touched && meta.error ? "border-red-500 focus:ring-red-500" : ""
         }`}
      />
      {meta.touched && meta.error && (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default CustomSelect;
