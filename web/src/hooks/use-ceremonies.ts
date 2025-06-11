"use client";

import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Ceremony = {
  id: string;
  type: "DAILY" | "PLANNING" | "REVIEW" | "RETROSPECTIVE" | "OTHER";
  typeDesc?: string;
  scheduledAt: string | Date;
  startTime: string | Date;
  endTime: string | Date;
  duration?: number;
  participants: string[];
  createdAt: string;
  updatedAt: string;
  sprintId?: string;
  sprint?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    trimesterId: string;
  };
};

export type CeremonyForm = {
  type: "DAILY" | "PLANNING" | "REVIEW" | "RETROSPECTIVE" | "OTHER";
  typeDesc?: string;
  scheduledAt: Date;
  startTime: Date;
  endTime: Date;
  duration?: number;
  participants: string[];
  sprintId?: string;
};

export function useCeremonies() {
  const queryClient = useQueryClient();

  const {
    data: ceremonies = [],
    isLoading: loading,
    error,
  } = useQuery<Ceremony[], Error>({
    queryKey: ["ceremonies"],
    queryFn: async () => {
      const res = await api.get("/scrum/ceremonies");
      return res.data;
    },
  });

  const createCeremonyMutation = useMutation({
    mutationFn: async (data: CeremonyForm) => {
      await api.post("/scrum/ceremonies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ceremonies"] });
    },
  });

  const deleteCeremonyMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scrum/ceremonies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ceremonies"] });
    },
  });

  const updateCeremonyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.put(`/scrum/ceremonies/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ceremonies"] });
    },
  });

  return {
    ceremonies,
    loading,
    error: error ? error.message : null,
    fetchCeremonies: () =>
      queryClient.invalidateQueries({ queryKey: ["ceremonies"] }),
    createCeremony: createCeremonyMutation.mutateAsync,
    deleteCeremony: deleteCeremonyMutation.mutateAsync,
    updateCeremony: updateCeremonyMutation.mutateAsync,
  };
}
