import { ReactNode } from "react";

export default function ScrollableList({ children }: { children: ReactNode }) {
  return (
    <section className="flex-1 overflow-y-auto mt-6 pb-20 px-0.5">
      <ul className="flex flex-col gap-4">{children}</ul>
    </section>
  );
}
