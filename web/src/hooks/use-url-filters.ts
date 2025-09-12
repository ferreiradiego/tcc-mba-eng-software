import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { usePathUpdater } from "./use-path-updater";

type Filters<T> = { [K in keyof T]: string | null };

export function useUrlFilters<T extends Record<string, unknown>>(
  keys: (keyof T)[]
): {
  filters: Filters<T>;
  clearFilters: () => void;
  updatePath: ReturnType<typeof usePathUpdater>["updatePath"];
} {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { updatePath } = usePathUpdater();

  const filters = keys.reduce((acc, key) => {
    const value = searchParams.get(key as string);
    return { ...acc, [key]: value as string | null };
  }, {} as Filters<T>);

  const clearFilters = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  return { filters, clearFilters, updatePath };
}
