"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  useReportTasks,
  useReportCeremonies,
} from "@/hooks/use-reports-details";
import { Download, ListChecks, Users } from "lucide-react";
import { useState, useCallback } from "react";

function useExportReport(userId?: string) {
  return useCallback(
    async (type: "tasks" | "ceremonies", format = "pdf", viewOnly = false) => {
      if (!userId) return;
      const url = `/api/reports/export?userId=${userId}&format=${format}&type=${type}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/pdf" },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      if (viewOnly) {
        window.open(blobUrl, "_blank");
      } else {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `relatorio-${type}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    },
    [userId]
  );
}

export default function ReportsDetails() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const [tab, setTab] = useState<"tasks" | "ceremonies">("tasks");
  const { data: tasksData, isLoading: loadingTasks } = useReportTasks(user?.id);
  const { data: ceremoniesData, isLoading: loadingCeremonies } =
    useReportCeremonies(user?.id);
  const exportReport = useExportReport(user?.id);

  return (
    <Card className="p-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={tab === "tasks" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("tasks")}
        >
          <ListChecks className="w-4 h-4 mr-1" /> Tarefas
        </Button>
        <Button
          variant={tab === "ceremonies" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("ceremonies")}
        >
          <Users className="w-4 h-4 mr-1" /> Cerimônias
        </Button>
      </div>
      {tab === "tasks" && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Relatório de Tarefas</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportReport("tasks", "pdf", true)}
                title="Visualizar PDF"
              >
                <Download className="w-4 h-4 mr-1" /> Visualizar PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportReport("tasks", "pdf", false)}
                title="Baixar PDF"
              >
                <Download className="w-4 h-4 mr-1" /> Baixar PDF
              </Button>
            </div>
          </div>
          {loadingTasks ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-2/3 rounded" />
              ))}
            </div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {tasksData?.data?.length > 0 ? (
                tasksData.data.map((t: any) => (
                  <li key={t.id} className="text-sm">
                    {t.title || t.name || t.id}
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">
                  Nenhuma tarefa encontrada.
                </li>
              )}
            </ul>
          )}
        </div>
      )}
      {tab === "ceremonies" && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Relatório de Cerimônias</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportReport("ceremonies", "pdf", true)}
                title="Visualizar PDF"
              >
                <Download className="w-4 h-4 mr-1" /> Visualizar PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportReport("ceremonies", "pdf", false)}
                title="Baixar PDF"
              >
                <Download className="w-4 h-4 mr-1" /> Baixar PDF
              </Button>
            </div>
          </div>
          {loadingCeremonies ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-2/3 rounded" />
              ))}
            </div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {ceremoniesData?.data?.length > 0 ? (
                ceremoniesData.data.map((c: any) => (
                  <li key={c.id} className="text-sm">
                    {c.type} -{" "}
                    {c.scheduledAt
                      ? new Date(c.scheduledAt).toLocaleDateString()
                      : c.id}
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">
                  Nenhuma cerimônia encontrada.
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
