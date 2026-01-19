import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  className?: string
}

export default function Button({ variant = "primary", className,  ...props }: ButtonProps) {
  const defaultClass = twMerge("px-4 py-1 border border-blue-500 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2", className);
  const variantClasses = variant === "primary" ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500" : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500";

  return <button className={`${defaultClass} ${variantClasses}`} {...props} />;
}
