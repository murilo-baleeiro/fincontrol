"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

interface GroupConfigProps {
  title: string;
  children: ReactNode;
}

export default function GroupConfig({ title, children }: GroupConfigProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border border-gray-200 rounded p-2">
      <button onClick={() => setOpen(!open)} className="flex flex-row justify-between gap-1 items-center w-full">
        {title}
        <ChevronRight strokeWidth={1.25} className={`transition-all duration-100 ${open && "rotate-90"}`} />
      </button>

      <div
        ref={contentRef}
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
        className="overflow-hidden transition-all duration-200 ease-out"
      >
        <div className="mt-2 px-1">{children}</div>
      </div>
    </div>
  );
}
