import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { usePathUpdater } from "./use-path-updater";

export function useUrlFilters<T extends Record<string, any>>(
  keys: (keyof T)[]
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { updatePath } = usePathUpdater();

  const filters = keys.reduce((acc, key) => {
    const value = searchParams.get(key as string);
    return { ...acc, [key]: value };
  }, {} as T);

  const clearFilters = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  return { filters, clearFilters, updatePath };
}
