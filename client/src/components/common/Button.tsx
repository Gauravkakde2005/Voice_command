import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-coral text-white hover:bg-[#e2514d]",
  secondary: "bg-brand-ink text-white hover:bg-[#0b2139]",
  ghost: "bg-white/70 text-brand-ink hover:bg-white",
  danger: "bg-red-500 text-white hover:bg-red-600"
};

export const Button = ({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-60",
      variants[variant],
      fullWidth && "w-full",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
