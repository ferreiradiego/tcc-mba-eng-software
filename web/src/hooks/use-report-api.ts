import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import api from "@/lib/api";

export function useReportApi(userId?: string, year?: number, number?: number) {
  const summary = useQuery({
    queryKey: ["report-summary", userId, year, number],
    enabled: !!userId,
    queryFn: async () => {
      const params = new URLSearchParams({ userId: String(userId) });
      if (year) params.append("year", String(year));
      if (number) params.append("number", String(number));
      const res = await api.get(`/reports/summary?${params.toString()}`);
      return res.data;
    },
  });

  const tasks = useQuery({
    queryKey: ["report-tasks", userId, year, number],
    enabled: !!userId,
    queryFn: async () => {
      const params = new URLSearchParams({ userId: String(userId) });
      if (year) params.append("year", String(year));
      if (number) params.append("number", String(number));
      const res = await api.get(`/reports/tasks?${params.toString()}`);
      return res.data;
    },
  });

  const ceremonies = useQuery({
    queryKey: ["report-ceremonies", userId, year, number],
    enabled: !!userId,
    queryFn: async () => {
      const params = new URLSearchParams({ userId: String(userId) });
      if (year) params.append("year", String(year));
      if (number) params.append("number", String(number));
      const res = await api.get(`/reports/ceremonies?${params.toString()}`);
      return res.data;
    },
  });

  const exportReport = useCallback(
    async (
      type: "summary" | "tasks" | "ceremonies",
      format = "pdf",
      year?: number,
      number?: number
    ) => {
      if (!userId) return;
      const params = new URLSearchParams({
        userId: userId,
        type,
        format,
      });
      if (year) params.append("year", String(year));
      if (number) params.append("number", String(number));
      const res = await api.get(`/reports/export?${params.toString()}`, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    },
    [userId]
  );

  return { summary, tasks, ceremonies, exportReport };
}
