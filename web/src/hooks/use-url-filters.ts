import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Hook para sincronizar filtros com a URL (query params).
 * Permite ler e atualizar filtros de forma reutilizável.
 *
 * @param keys Chaves dos filtros a sincronizar
 * @returns [filters, setFilter]
 */
export function useUrlFilters<T extends Record<string, any>>(
  keys: (keyof T)[]
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = keys.reduce((acc, key) => {
    const value = searchParams.get(key as string);
    return { ...acc, [key]: value };
  }, {} as T);

  const setFilter = useCallback(
    (key: keyof T, value: any) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === null || value === "") {
        params.delete(key as string);
      } else {
        params.set(key as string, value);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  return { filters, setFilter, clearFilters };
}
