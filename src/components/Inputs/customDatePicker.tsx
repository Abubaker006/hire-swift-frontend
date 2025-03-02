import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useField, useFormikContext } from "formik";

interface CustomDatePickerProps {
  label: string;
  name: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ label, name }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <div className="flex flex-col w-full">
      <label className="block text-sm font-medium mb-1.5 text-[#000]">
        {label}
      </label>

      <DatePicker
        selected={field.value ? new Date(field.value) : null}
        onChange={(date) => setFieldValue(name, date)}
        placeholderText={label}
        showIcon={true}
        icon={
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="text-gray-500 h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 "
          />
        }
        className="w-full h-[50px] p-2.5 border border-gray-300 rounded-md text-black 
             placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E17EB] 
             transition-all duration-200 "
      />
      {meta.touched && meta.error && (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default CustomDatePicker;
