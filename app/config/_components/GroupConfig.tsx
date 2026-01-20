"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface GroupDownProps {
  title: string;
  children: ReactNode;
}

export default function GroupDown({ title, children }: GroupDownProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (open && contentRef.current) setHeight(`${contentRef.current.scrollHeight}px`);
  }, [children, open]); // 👈 recalcula quando o conteúdo muda

  return (
    <div className="border border-gray-200 rounded p-2">
      <button onClick={() => setOpen(!open)} className="flex flex-row justify-between gap-1 items-center w-full">
        {title}
        <ChevronRight strokeWidth={1.25} className={`transition-all duration-100 ${open && "rotate-90"}`} />
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight: open ? height : "0px" }}
        className="overflow-hidden transition-all duration-200 ease-out"
      >
        <div className="mt-2 px-1">{children}</div>
      </div>
    </div>
  );
}
