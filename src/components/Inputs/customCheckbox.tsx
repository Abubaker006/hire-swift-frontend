import React, { FC, InputHTMLAttributes } from "react";
import { useField } from "formik";

interface ICustomCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string; 
}

const CustomCheckbox: FC<ICustomCheckboxProps> = ({ label, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });

  return (
    <div className="flex items-center gap-2">
      <input
        {...field}
        {...props}
        type="checkbox"
        className={` w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-md 
         focus:ring-blue-500 focus:ring-2 ${meta.touched && meta.error ? "border-red-500 focus:ring-red-500" : ""}`}
      />
      <label htmlFor={props.id || props.name}>{label}</label>

      {meta.touched && meta.error && <div className="text-red-500 text-xs mt-1">{meta.error}</div>}
    </div>
  );
};

export default CustomCheckbox;
