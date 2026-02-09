"use client";

import { useEffect, useState } from "react";

const DEFAULT_MS = 400;

export function useDebounce<T>(value: T, delayMs: number = DEFAULT_MS): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
