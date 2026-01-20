// ComboBox.tsx
interface ComboBoxProps {
  label?: string;
  options: { id: string; name: string }[];
  value: number | null;
  onChange: (value: number) => void;
}

export default function ComboBox({ label, options, value, onChange }: ComboBoxProps) {
  return (
    <fieldset className="w-full">
      {label && <label>{label}</label>}

      <select className="w-full px-2 py-1.5 border border-gray-400 rounded" value={value ?? ""} onChange={(e) => onChange(parseInt(e.target.value))}>
        <option value={null!} disabled>
          Selecione uma opção
        </option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
