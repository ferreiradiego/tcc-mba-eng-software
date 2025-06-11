import { usePathname, useRouter } from "next/navigation";

export const usePathUpdater = () => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const updatePath = (query: string) => {
    replace(`${pathname}?${query}`);
  };

  return { updatePath };
};
