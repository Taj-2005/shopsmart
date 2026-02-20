"use client";

import { render, screen } from "@testing-library/react";
import { ProtectedRoute, AdminRoute } from "@/components/auth/protected-route";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/admin",
}));

jest.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isInitialized: true,
    isLoading: false,
  }),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("redirects to login when not authenticated", () => {
    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("/login"));
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});

describe("AdminRoute", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("redirects when not authenticated", () => {
    render(
      <AdminRoute>
        <div>Admin content</div>
      </AdminRoute>
    );
    expect(mockReplace).toHaveBeenCalled();
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });
});
