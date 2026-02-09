"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/lib/validation";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { AuthFormField } from "@/components/auth/auth-form-field";

const DEBOUNCE_MS = 400;

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const debouncedEmail = useDebounce(email, DEBOUNCE_MS);
  const debouncedPassword = useDebounce(password, DEBOUNCE_MS);

  const emailValidation = validateEmail(debouncedEmail);
  const passwordValidation = validatePassword(debouncedPassword);
  const confirmValidation = validateConfirmPassword(confirmPassword, password);

  const emailValid = emailValidation.valid;
  const passwordValid = passwordValidation.valid;
  const confirmValid = confirmValidation.valid;

  const showEmailError =
    (emailTouched || passwordTouched || confirmTouched) && !emailValid;
  const showPasswordError =
    (passwordTouched || confirmTouched) && emailValid && !passwordValid;
  const showConfirmError =
    confirmTouched && emailValid && passwordValid && !confirmValid;

  const emailError = showEmailError ? emailValidation.message : "";
  const passwordError = showPasswordError ? passwordValidation.message : "";
  const confirmError = showConfirmError ? confirmValidation.message : "";

  const formValid = emailValid && passwordValid && confirmValid;

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setEmailTouched(true);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setPasswordTouched(true);
  }, []);

  const handleConfirmChange = useCallback((value: string) => {
    setConfirmPassword(value);
    setConfirmTouched(true);
  }, []);

  const handlePasswordFocus = useCallback(() => {
    setEmailTouched(true);
  }, []);

  const handleConfirmFocus = useCallback(() => {
    setPasswordTouched(true);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <AuthFormLayout
      title="Create account"
      alternateHref="/login"
      alternateLabel="Log in"
      alternatePrompt="Already have an account?"
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <AuthFormField
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => setEmailTouched(true)}
          error={emailError}
          hasShake={!!emailError}
          autoComplete="email"
        />
        <AuthFormField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => setPasswordTouched(true)}
          onFocus={handlePasswordFocus}
          error={passwordError}
          hasShake={!!passwordError}
          autoComplete="new-password"
        />
        <AuthFormField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmChange}
          onBlur={() => setConfirmTouched(true)}
          onFocus={handleConfirmFocus}
          error={confirmError}
          hasShake={!!confirmError}
          autoComplete="new-password"
        />
        <div className="pt-1">
          <button
            type="submit"
            disabled={!formValid}
            className="w-full rounded-[var(--radius)] bg-accent py-3 text-base font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent"
          >
            Create account
          </button>
        </div>
      </form>
    </AuthFormLayout>
  );
}
