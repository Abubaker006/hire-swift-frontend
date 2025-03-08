import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  icon?: "edit" | "delete" | "view";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}) => {
  const baseStyles =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg";
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
    danger: "bg-red-800 hover:bg-red-900 text-white",
  };

  const iconComponents = {
    edit: <FontAwesomeIcon icon={faEdit} />,
    delete: <FontAwesomeIcon icon={faTrash} />,
    view: <FontAwesomeIcon icon={faEye} />,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconComponents[icon]}
      {children}
    </button>
  );
};

export default Button;
