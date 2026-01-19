import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  const defaultClass = twMerge("border border-gray-400 rounded px-2 py-1", className);

  return (
    <fieldset className="flex flex-col">
      {label && <label className="text-gray-900 text-sm">{label}</label>}
      <input type="text" className={defaultClass} {...props} />
    </fieldset>
  );
}
