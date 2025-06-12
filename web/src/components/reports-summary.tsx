"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useReportApi } from "@/hooks/use-report-api";
import { useTrimesters } from "@/hooks/use-trimesters";
import { Download, ListChecks, Users } from "lucide-react";
import { useMemo, useState } from "react";

export default function ReportsSummary() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { summary, exportReport } = useReportApi(user?.id);
  const { trimesters, loading: loadingTrimesters } = useTrimesters();

  const defaultTrimesterId =
    trimesters.length > 0 ? trimesters[trimesters.length - 1].id : "";
  const [selectedTrimester, setSelectedTrimester] =
    useState<string>(defaultTrimesterId);

  const selectedTrimesterObj = useMemo(() => {
    return (
      trimesters.find((t) => t.id === selectedTrimester) ||
      trimesters[trimesters.length - 1]
    );
  }, [selectedTrimester, trimesters]);

  function handleExport(type: "summary" | "tasks" | "ceremonies") {
    if (!user?.id || !selectedTrimesterObj) return;
    exportReport(
      type,
      "pdf",
      selectedTrimesterObj.year,
      selectedTrimesterObj.number
    );
  }

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
    <div className="flex flex-row">
      <Select
        value={selectedTrimester || defaultTrimesterId}
        onValueChange={setSelectedTrimester}
        disabled={loadingTrimesters || trimesters.length === 0}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o trimestre" />
        </SelectTrigger>
        <SelectContent>
          {trimesters.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.year} - {t.number}º trimestre
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-row gap-4 flex-1 justify-end">
        <Button
          variant="outline"
          onClick={() => handleExport("summary")}
          title="Exportar Resumo PDF"
        >
          <Download className="w-4 h-4 mr-2 text-blue-700" /> Resumo
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExport("tasks")}
          title="Exportar Tarefas PDF"
        >
          <ListChecks className="w-4 h-4 mr-2 text-green-700" /> Tarefas
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExport("ceremonies")}
          title="Exportar Cerimônias PDF"
        >
          <Users className="w-4 h-4 mr-2 text-orange-700" /> Cerimônias
        </Button>
      </div>
    </div>
  );
}
