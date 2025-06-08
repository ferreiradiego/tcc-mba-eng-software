import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import api from "@/lib/api";

export function useReportApi(userId?: string) {
  // Summary
  const summary = useQuery({
    queryKey: ["report-summary", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await api.get(`/reports/summary?userId=${userId}`);
      return res.data;
    },
  });

  // Tasks
  const tasks = useQuery({
    queryKey: ["report-tasks", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await api.get(`/reports/tasks?userId=${userId}`);
      return res.data;
    },
  });

  // Ceremonies
  const ceremonies = useQuery({
    queryKey: ["report-ceremonies", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await api.get(`/reports/ceremonies?userId=${userId}`);
      return res.data;
    },
  });

  // Export PDF
  const exportReport = useCallback(
    async (type: "summary" | "tasks" | "ceremonies", format = "pdf") => {
      if (!userId) return;

      const res = await api.get(
        `/reports/export?userId=${userId}&type=${type}&format=${format}`,
        { responseType: "arraybuffer" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");

      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    },
    [userId]
  );

  return { summary, tasks, ceremonies, exportReport };
}
