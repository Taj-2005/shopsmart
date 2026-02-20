export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  pathname: "/",
  query: {},
});

export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams();
