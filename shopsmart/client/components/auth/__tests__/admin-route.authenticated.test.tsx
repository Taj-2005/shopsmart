"use client";

import { render, screen } from "@testing-library/react";
import { AdminRoute } from "@/components/auth/protected-route";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/admin",
}));

jest.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    user: { id: "1", email: "a@b.com", fullName: "Admin", role: "admin" as const },
    isAuthenticated: true,
    isInitialized: true,
    isLoading: false,
  }),
}));

describe("AdminRoute when authenticated as admin", () => {
  beforeEach(() => mockReplace.mockClear());

  it("renders children when user has admin role", () => {
    render(
      <AdminRoute>
        <div>Admin content</div>
      </AdminRoute>
    );
    expect(screen.getByText("Admin content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
