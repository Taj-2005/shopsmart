import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-stone-800 active:bg-stone-900",
  secondary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-stone-200 active:bg-stone-300",
  ghost: "hover:bg-stone-100 active:bg-stone-200",
  outline:
    "border-2 border-[var(--border)] bg-transparent hover:border-stone-400 hover:bg-stone-50",
};

const sizeClasses = {
  sm: "h-10 px-4 text-sm rounded-[var(--radius-sm)]",
  md: "h-12 px-6 text-base rounded-[var(--radius)]",
  lg: "h-14 px-8 text-lg rounded-[var(--radius)]",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
