"use client";

import { useId } from "react";

interface AuthFormFieldProps {
  label: string;
  type: "email" | "password" | "text";
  value: string;
  onChange: (value: string) => void;
  error: string;
  hasShake: boolean;
  autoComplete?: string;
  required?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export function AuthFormField({
  label,
  type,
  value,
  onChange,
  error,
  hasShake,
  autoComplete,
  required = true,
  onBlur,
  onFocus,
}: AuthFormFieldProps) {
  const id = useId();
  const hasError = !!error;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-primary"
      >
        {label}
        {required && <span className="text-[var(--color-error)]" aria-hidden> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        autoComplete={autoComplete}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={`block w-full rounded-[var(--radius-sm)] border bg-surface px-4 py-3 text-primary transition-colors placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60 ${
          hasError
            ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
            : "border-border focus-visible:ring-accent"
        } ${hasShake ? "input-shake" : ""}`}
      />
      {hasError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm text-[var(--color-error)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
