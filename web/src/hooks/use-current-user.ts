import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function useCurrentUser() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { user, isLoading, error };
}
