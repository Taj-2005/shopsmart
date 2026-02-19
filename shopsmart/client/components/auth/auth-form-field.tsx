"use client";

import { useId, useState } from "react";

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
  showPasswordToggle?: boolean;
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
  showPasswordToggle = false,
}: AuthFormFieldProps) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;
  const inputType = type === "password" && showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-primary"
      >
        {label}
        {required && <span className="text-[var(--color-error)]" aria-hidden> *</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
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
            showPasswordToggle && type === "password" ? "pr-12" : ""
          } ${
            hasError
              ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
              : "border-border focus-visible:ring-accent"
          } ${hasShake ? "input-shake" : ""}`}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent rounded p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
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
