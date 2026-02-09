import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent/90 active:bg-accent/80 focus-visible:ring-accent",
  secondary:
    "bg-muted text-primary hover:bg-muted/80 active:bg-muted/70 focus-visible:ring-accent",
  ghost:
    "text-primary hover:bg-muted active:bg-muted/80 focus-visible:ring-accent",
  outline:
    "border-2 border-border bg-surface text-primary hover:bg-muted focus-visible:ring-accent",
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
