"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { validateEmail, validatePassword } from "@/lib/validation";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { AuthFormField } from "@/components/auth/auth-form-field";
import { useAuth } from "@/context/auth-context";

const DEBOUNCE_MS = 400;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/home";
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const debouncedEmail = useDebounce(email, DEBOUNCE_MS);
  const debouncedPassword = useDebounce(password, DEBOUNCE_MS);

  const emailValidation = validateEmail(debouncedEmail);
  const passwordValidation = validatePassword(debouncedPassword);

  const emailValid = emailValidation.valid;
  const passwordValid = passwordValidation.valid;

  const showEmailError = (emailTouched || passwordTouched) && !emailValid;
  const showPasswordError = passwordTouched && emailValid && !passwordValid;

  const emailError = showEmailError ? emailValidation.message : "";
  const passwordError = showPasswordError ? passwordValidation.message : "";

  const formValid = emailValid && passwordValid;

  useEffect(() => {
    if (isAuthenticated) router.replace(redirect);
  }, [isAuthenticated, redirect, router]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formValid || isLoading) return;
      try {
        await login(email.trim(), password, rememberMe);
        router.replace(redirect);
      } catch {
        // error set in context
      }
    },
    [formValid, isLoading, login, email, password, rememberMe, redirect, router]
  );

  return (
    <AuthFormLayout
      title="Log in"
      alternateHref="/signup"
      alternateLabel="Create an account"
      alternatePrompt="Don't have an account?"
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-[var(--radius-sm)] border border-[var(--color-error)] bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]"
          >
            {error}
          </div>
        )}
        <AuthFormField
          label="Email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setEmailTouched(true);
          }}
          onBlur={() => setEmailTouched(true)}
          error={emailError}
          hasShake={!!emailError}
          autoComplete="email"
        />
        <AuthFormField
          label="Password"
          type="password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setPasswordTouched(true);
          }}
          onBlur={() => setPasswordTouched(true)}
          onFocus={() => setEmailTouched(true)}
          error={passwordError}
          hasShake={!!passwordError}
          autoComplete="current-password"
          showPasswordToggle
        />
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-primary">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-accent focus-visible:ring-accent"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            Forgot password?
          </Link>
        </div>
        <div className="pt-1">
          <button
            type="submit"
            disabled={!formValid || isLoading}
            className="w-full rounded-[var(--radius)] bg-accent py-3 text-base font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent"
          >
            {isLoading ? "Signing in…" : "Log in"}
          </button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <span className="text-center text-sm text-muted-foreground">Or continue with</span>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              disabled
              className="rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted-foreground opacity-60"
            >
              Google (coming soon)
            </button>
            <button
              type="button"
              disabled
              className="rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted-foreground opacity-60"
            >
              GitHub (coming soon)
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/home"
            className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            Continue as guest
          </Link>
        </p>
      </form>
    </AuthFormLayout>
  );
}
