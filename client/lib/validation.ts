export function validateEmail(value: string): { valid: boolean; message: string } {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Email is required" };
  if (!trimmed.includes("@")) return { valid: false, message: "Email must include @" };
  return { valid: true, message: "" };
}

const PASSWORD_MIN_LENGTH = 8;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_LOWERCASE = /[a-z]/;
const HAS_SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export function validatePassword(value: string): { valid: boolean; message: string } {
  if (!value) return { valid: false, message: "Password is required" };
  if (value.length < PASSWORD_MIN_LENGTH)
    return { valid: false, message: "Password must be at least 8 characters" };
  if (!HAS_UPPERCASE.test(value))
    return { valid: false, message: "Password must contain at least 1 uppercase letter" };
  if (!HAS_LOWERCASE.test(value))
    return { valid: false, message: "Password must contain at least 1 lowercase letter" };
  if (!HAS_SPECIAL.test(value))
    return { valid: false, message: "Password must contain at least 1 special character" };
  return { valid: true, message: "" };
}

export function validateConfirmPassword(
  value: string,
  password: string
): { valid: boolean; message: string } {
  if (!value) return { valid: false, message: "Please confirm your password" };
  if (value !== password) return { valid: false, message: "Passwords do not match" };
  return { valid: true, message: "" };
}
