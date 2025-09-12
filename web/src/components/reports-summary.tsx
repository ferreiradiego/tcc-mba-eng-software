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
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-4 items-end">
        <Select
          value={selectedTrimester || defaultTrimesterId}
          onValueChange={setSelectedTrimester}
          disabled={loadingTrimesters || trimesters.length === 0}
        >
          <SelectTrigger className="w-[200px]">
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
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {/* Resumo */}
        <div className="p-4 bg-white rounded-xl shadow flex flex-row items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold mb-1 text-blue-900 flex items-center gap-1">
                Resumo
              </h2>
              <p className="text-sm text-gray-600">Exporta um PDF com um panorama geral do trimestre selecionado, incluindo totais de tarefas, cerimônias e progresso.</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => handleExport("summary")}
            title="Exportar Resumo PDF"
            className="ml-4"
          >
            <Download className="w-4 h-4 mr-2 text-blue-700" /> Resumo
          </Button>
        </div>
        {/* Tarefas */}
        <div className="p-4 bg-white rounded-xl shadow flex flex-row items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <ListChecks className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold mb-1 text-green-900 flex items-center gap-1">
                Tarefas
              </h2>
              <p className="text-sm text-gray-600">Exporta um PDF detalhado com todas as tarefas do trimestre, seus responsáveis, status e prazos.</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => handleExport("tasks")}
            title="Exportar Tarefas PDF"
            className="ml-4"
          >
            <ListChecks className="w-4 h-4 mr-2 text-green-700" /> Tarefas
          </Button>
        </div>
        {/* Cerimônias */}
        <div className="p-4 bg-white rounded-xl shadow flex flex-row items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center gap-3">
            <div className="bg-orange-100 rounded-full p-2">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold mb-1 text-orange-900 flex items-center gap-1">
                Cerimônias
              </h2>
              <p className="text-sm text-gray-600">Exporta um PDF com todas as cerimônias agendadas e realizadas no trimestre, incluindo datas e participantes.</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => handleExport("ceremonies")}
            title="Exportar Cerimônias PDF"
            className="ml-4"
          >
            <Users className="w-4 h-4 mr-2 text-orange-700" /> Cerimônias
          </Button>
        </div>
      </div>
    </div>
  );
}
