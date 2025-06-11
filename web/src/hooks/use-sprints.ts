import api from "@/lib/api";
import { queryClient } from "@/lib/react-query-client";
import { useQuery, useMutation } from "@tanstack/react-query";

export type Sprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  trimesterId: string;
};

export type SprintForm = {
  name: string;
  startDate: string;
  endDate: string;
  trimesterId: string;
};

export function useSprints() {
  const {
    data: sprints = [],
    isLoading: loading,
    error,
  } = useQuery<Sprint[], Error>({
    queryKey: ["sprints"],
    queryFn: async () => {
      const res = await api.get("/scrum/sprints");
      return res.data;
    },
  });

  const createSprintMutation = useMutation({
    mutationFn: async (data: SprintForm) => {
      await api.post("/scrum/sprints", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
    },
  });

  const deleteSprintMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scrum/sprints/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
    },
  });

  const updateSprintMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SprintForm }) => {
      await api.put(`/scrum/sprints/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
    },
  });

  return {
    sprints,
    loading,
    error: error ? error.message : null,
    fetchSprints: () => queryClient.invalidateQueries({ queryKey: ["sprints"] }),
    createSprint: createSprintMutation.mutateAsync,
    deleteSprint: deleteSprintMutation.mutateAsync,
    updateSprint: updateSprintMutation.mutateAsync,
  };
}
