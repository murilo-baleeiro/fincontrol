"use client";

import { ChevronRight } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface GroupDownProps {
  title: string | ReactNode;
  children: ReactNode;
}

export default function GroupDown({ title, children }: GroupDownProps) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && contentRef.current) setHeight(`${contentRef.current.scrollHeight}px`);
  }, [children, open]);

  return (
    <div className="border border-gray-200 rounded p-2">
      <button onClick={() => setOpen(!open)} className="flex flex-row justify-between gap-1 items-center w-full">
        {title}
        <ChevronRight strokeWidth={1.25} className={`transition-all duration-100 ${open && "rotate-90"}`} />
      </button>

      <div ref={contentRef} style={{ maxHeight: open ? height : "0px" }} className="overflow-hidden transition-all duration-200 ease-out">
        <div className="mt-2 px-1">{children}</div>
      </div>
    </div>
  );
}
