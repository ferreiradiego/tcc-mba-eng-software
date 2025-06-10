import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type TimeLog = {
  id: string;
  userId: string;
  taskId: string;
  completedAt?: string | Date;
  duration?: number;
  status: "running" | "paused" | "stopped" | "finished";
  createdAt: string;
  updatedAt: string;
};

export type TimeLogForm = {
  taskId: string;
  duration?: number;
  status: "running" | "paused" | "stopped" | "finished";
};

export function useTimeLogs() {
  const queryClient = useQueryClient();

  const {
    data: timelogs = [],
    isLoading: loading,
    error,
  } = useQuery<TimeLog[], Error>({
    queryKey: ["timelogs"],
    queryFn: async () => {
      const res = await api.get("/scrum/timelogs");
      return res.data;
    },
  });

  const createTimeLogMutation = useMutation({
    mutationFn: async (data: TimeLogForm) => {
      await api.post("/scrum/timelogs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
    },
  });

  const deleteTimeLogMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scrum/timelogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
    },
  });

  const updateTimeLogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.put(`/scrum/timelogs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
    },
  });

  return {
    timelogs,
    loading,
    error: error ? error.message : null,
    fetchTimeLogs: () => queryClient.invalidateQueries({ queryKey: ["timelogs"] }),
    createTimeLog: createTimeLogMutation.mutateAsync,
    deleteTimeLog: deleteTimeLogMutation.mutateAsync,
    updateTimeLog: updateTimeLogMutation.mutateAsync,
  };
}
