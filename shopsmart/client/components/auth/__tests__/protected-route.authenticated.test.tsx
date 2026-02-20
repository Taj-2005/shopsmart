"use client";

import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "@/components/auth/protected-route";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/dashboard",
}));

jest.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    user: { id: "1", email: "a@b.com", fullName: "User", role: "customer" as const },
    isAuthenticated: true,
    isInitialized: true,
    isLoading: false,
  }),
}));

describe("ProtectedRoute when authenticated", () => {
  beforeEach(() => mockReplace.mockClear());

  it("renders children when authenticated", () => {
    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText("Protected content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
