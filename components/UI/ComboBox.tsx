"use client";

import { useEffect } from "react";

interface ComboBoxProps {
  label?: string;
  options: any[];
  value: any | null;
  onChange: (value: any) => void;
}

export default function ComboBox({ label, options, value, onChange }: ComboBoxProps) {
  useEffect(() => {}, [value]);

  return (
    <fieldset className="w-full">
      {label && <label>{label}</label>}

      <select className="w-full px-2 py-1.5 border border-gray-400 rounded" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
        <option value={""} disabled>
          Selecione uma opção
        </option>

        {Array.isArray(options) &&
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
      </select>
    </fieldset>
  );
}
