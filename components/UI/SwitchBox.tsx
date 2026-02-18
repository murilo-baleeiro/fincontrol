export default function SwitchBox({ checked, onSwitch }: { checked: boolean; onSwitch: (checked: boolean) => void }) {
  return (
    <label className={`mx-1 relative inline-flex items-center cursor-pointer ${checked ? "bg-green-500" : "bg-gray-300"} rounded-full w-10 h-6 transition-colors duration-300`}>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onSwitch(e.target.checked)} />
      <span className={`absolute left-1 top-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </label>
  );
}
