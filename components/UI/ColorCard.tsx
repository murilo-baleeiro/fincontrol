import { ReactNode } from "react";

export default function ColorCard({ children, color }: { children: ReactNode; color: string }) {
  const colorMap: { [key: string]: string } = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    gray: "bg-gray-500",
  };

  color = colorMap[color] || "bg-gray-500";

  return (
    <div className={`w-full flex flex-col justify-center items-start gap-2 pl-4 py-4 ${color} text-white rounded-lg shadow-md`}>
      {children}
    </div>
  );
}
