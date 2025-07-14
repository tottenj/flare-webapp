
export function useRouter() {
  return {
    push: (url: string) => Promise.resolve(),
    replace: (url: string) => Promise.resolve(),
    refresh: () => {},
    back: () => {},
    prefetch: () => Promise.resolve(),
  };
}

export function usePathname() {
  return '/';
}

export function useSearchParams() {
  return new URLSearchParams();
}
