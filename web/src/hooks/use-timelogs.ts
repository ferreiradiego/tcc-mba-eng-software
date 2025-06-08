import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type TimeLog = {
  id: string;
  userId: string;
  taskId: string;
  startTime: string | Date;
  endTime?: string | Date;
  duration?: number;
  status: "running" | "paused" | "stopped";
  createdAt: string;
  updatedAt: string;
};

export type TimeLogForm = {
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: "running" | "paused" | "stopped";
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
      const res = await api.get("/timelogs");
      return res.data;
    },
  });

  const createTimeLogMutation = useMutation({
    mutationFn: async (data: TimeLogForm) => {
      await api.post("/timelogs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
    },
  });

  const deleteTimeLogMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/timelogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
    },
  });

  const updateTimeLogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.put(`/timelogs/${id}`, data);
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
