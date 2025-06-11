"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useReportApi } from "@/hooks/use-report-api";

export default function ReportsSummary() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { summary, tasks, ceremonies, exportReport } = useReportApi(user?.id);

  if (userLoading || summary.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3 rounded" />
        <Card className="p-4 space-y-2">
          <Skeleton className="h-5 w-1/2 rounded" />
          <Skeleton className="h-5 w-1/3 rounded" />
          <Skeleton className="h-5 w-1/4 rounded" />
        </Card>
      </div>
    );
  }

  if (summary.error) {
    return (
      <div className="text-red-500 text-center">Erro ao carregar relatório</div>
    );
  }

  return (
    <>
      <Card className="p-4 space-y-2 mb-4">
        <div className="font-bold text-lg mb-2">Resumo Geral</div>
        <div className="flex flex-col gap-1">
          <div>
            Tarefas:{" "}
            <span className="font-semibold">{summary.data?.data.totalTasks ?? 0}</span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="ml-2 px-2 py-0 h-6"
              title="Exportar tarefas PDF"
            >
              <a onClick={() => exportReport("tasks")}>
                <Download className="w-4 h-4" />
              </a>
            </Button>
          </div>
          <div>
            Cerimônias:{" "}
            <span className="font-semibold">
              {summary.data?.data.totalCeremonies ?? 0}
            </span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="ml-2 px-2 py-0 h-6"
              title="Exportar cerimônias PDF"
            >
              <a onClick={() => exportReport("ceremonies")}>
                <Download className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReport("summary")}
          >
            <Download className="w-4 h-4 mr-2" /> Exportar Resumo PDF
          </Button>
        </div>
      </Card>
      <Card className="p-4 space-y-2 mb-4">
        <div className="font-bold mb-2">Relatório de Tarefas</div>
        {tasks.isLoading ? (
          <Skeleton className="h-5 w-1/2 rounded" />
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {tasks.data?.data?.length > 0 ? (
              tasks.data.data.map((t: any) => (
                <li key={t.id} className="text-sm">
                  {t.title || t.name || t.id}
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">Nenhuma tarefa encontrada.</li>
            )}
          </ul>
        )}
      </Card>
      <Card className="p-4 space-y-2">
        <div className="font-bold mb-2">Relatório de Cerimônias</div>
        {ceremonies.isLoading ? (
          <Skeleton className="h-5 w-1/2 rounded" />
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {ceremonies.data?.data?.length > 0 ? (
              ceremonies.data.data.map((c: any) => (
                <li key={c.id} className="text-sm">
                  {c.type} -{" "}
                  {c.scheduledAt
                    ? new Date(c.scheduledAt).toLocaleDateString()
                    : c.id}
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">Nenhuma cerimônia encontrada.</li>
            )}
          </ul>
        )}
      </Card>
    </>
  );
}
