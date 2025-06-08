"use client";

import api from "@/lib/api";
import { queryClient } from "@/lib/react-query-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export type Task = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: string | Date; // pode vir como string do backend
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
};

export type TaskForm = {
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: Date;
  // dependencies?: string[]; // descomente se for usar no form
};

export function useTasks() {
  const {
    data: tasks = [],
    isLoading: loading,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskForm) => {
      await api.post("/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.put(`/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks,
    loading,
    error: error ? error.message : null,
    fetchTasks: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    createTask: createTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
  };
}
