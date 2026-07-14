import type { PropsWithChildren, SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export const Select = ({
  children,
  className,
  ...props
}: PropsWithChildren<SelectHTMLAttributes<HTMLSelectElement>>) => (
  <select
    className={cn(
      "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20",
      className
    )}
    {...props}
  >
    {children}
  </select>
);
