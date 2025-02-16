import React, { FC, InputHTMLAttributes } from "react";

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CheckBox: FC<CheckBoxProps> = ({ label, ...props }) => {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...props}
          className="w-5 h-5 appearance-none border border-gray-300 rounded-md bg-gray-100 
          checked:bg-[#5E17EB] checked:border-[#5E17EB] 
          focus:ring-2 focus:ring-[#5E17EB] cursor-pointer 
          relative flex items-center justify-center 
          before:content-['✔'] before:absolute before:text-white before:opacity-0 checked:before:opacity-100"
        />
        <label htmlFor={props.id || props.name} className="cursor-pointer">
          {label}
        </label>
      </div>
    );
  };
  
const Filters = () => {
  return (
    <>
      <h3 className="mt-5 font-semibold">Filters</h3>
      <div className="mt-3 space-y-2">
        <CheckBox
          id="full-time-checkbox"
          name="Full time"
          value="Full time"
          label="Full time"
        />
        <CheckBox
          id="full-time-checkbox"
          name="Project Work"
          value="Part time"
          label="Part time"
        />
        <CheckBox
          id="full-time-checkbox"
          name="Internship"
          value="Internship"
          label="Internship"
        />
        <CheckBox
          id="full-time-checkbox"
          name="Distant work"
          value="Distant work"
          label="Distant work"
        />
      </div>
    </>
  );
};

export default Filters;
