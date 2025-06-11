import api from "@/lib/api";
import { queryClient } from "@/lib/react-query-client";
import { useQuery, useMutation } from "@tanstack/react-query";

export type Trimester = {
  id: string;
  year: number;
  number: number;
};

export type TrimesterForm = {
  year: number;
  number: number;
};

export function useTrimesters() {
  const {
    data: trimesters = [],
    isLoading: loading,
    error,
  } = useQuery<Trimester[], Error>({
    queryKey: ["trimesters"],
    queryFn: async () => {
      const res = await api.get("/scrum/trimesters");
      return res.data;
    },
  });

  const createTrimesterMutation = useMutation({
    mutationFn: async (data: TrimesterForm) => {
      await api.post("/scrum/trimesters", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trimesters"] });
    },
  });

  const deleteTrimesterMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scrum/trimesters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trimesters"] });
    },
  });

  const updateTrimesterMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TrimesterForm }) => {
      await api.put(`/scrum/trimesters/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trimesters"] });
    },
  });

  return {
    trimesters,
    loading,
    error: error ? error.message : null,
    fetchTrimesters: () =>
      queryClient.invalidateQueries({ queryKey: ["trimesters"] }),
    createTrimester: createTrimesterMutation.mutateAsync,
    deleteTrimester: deleteTrimesterMutation.mutateAsync,
    updateTrimester: updateTrimesterMutation.mutateAsync,
  };
}
