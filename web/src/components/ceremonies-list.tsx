"use client";

import { CeremonyDialogForm } from "@/components/ceremony-dialog-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ceremony, useCeremonies } from "@/hooks/use-ceremonies";
import { CalendarCheck2, Clock, FilePen, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

function formatDuration(duration?: number): string | null {
  if (typeof duration !== "number" || duration <= 0) return null;
  if (duration < 60) return `${duration} min`;
  const h = Math.floor(duration / 60);
  const m = duration % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export default function CeremoniesList() {
  const { ceremonies, loading, error, deleteCeremony } = useCeremonies();
  const [editingCeremony, setEditingCeremony] = useState<Ceremony | null>(null);

  const typeMap: Record<
    string,
    { label: string; icon: JSX.Element; color: string }
  > = {
    DAILY: { label: "Daily", icon: <Users />, color: "text-blue-600" },
    PLANNING: {
      label: "Planning",
      icon: <CalendarCheck2 />,
      color: "text-green-600",
    },
    REVIEW: { label: "Review", icon: <Clock />, color: "text-yellow-600" },
    RETROSPECTIVE: {
      label: "Retrospective",
      icon: <Clock />,
      color: "text-purple-600",
    },
    OTHER: { label: "Outro", icon: <Clock />, color: "text-gray-600" },
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex items-center gap-4 p-4 border">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
                <Skeleton className="h-3 w-1/4 rounded" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {ceremonies.length > 0 ? (
            ceremonies.map((ceremony) => {
              const type = typeMap[ceremony.type] || {
                label: ceremony.type,
                icon: <Clock />,
                color: "text-muted-foreground",
              };
              const isDone =
                ceremony.scheduledAt &&
                new Date(ceremony.scheduledAt) <= new Date();
              return (
                <Card
                  key={ceremony.id}
                  className={`flex items-center gap-4 p-4 border shadow-sm ${
                    isDone ? "border-green-400" : "border-yellow-400"
                  }`}
                >
                  <div className={`rounded-full bg-muted p-3 ${type.color}`}>
                    {type.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg flex items-center gap-2">
                      <span>
                        {type.label}
                        {ceremony.type === "OTHER" && ceremony.typeDesc
                          ? `: ${ceremony.typeDesc}`
                          : null}
                      </span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {formatDuration(ceremony.duration)}
                      </span>
                      {/* Sprint tag */}
                      {ceremony.sprint && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 ml-2">
                          Sprint: {ceremony.sprint.name}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Agendada:{" "}
                      {ceremony.scheduledAt
                        ? format(new Date(ceremony.scheduledAt), "P", {
                            locale: ptBR,
                          })
                        : "-"}
                      {ceremony.startTime &&
                        ((ceremony.startTime instanceof Date &&
                          !isNaN(ceremony.startTime.getTime())) ||
                          (typeof ceremony.startTime === "string" &&
                            /^\d{2}:\d{2}$/.test(ceremony.startTime))) && (
                          <>
                            {" | Início: "}
                            {ceremony.startTime instanceof Date
                              ? ceremony.startTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ceremony.startTime}
                          </>
                        )}
                      {ceremony.endTime &&
                        ((ceremony.endTime instanceof Date &&
                          !isNaN(ceremony.endTime.getTime())) ||
                          (typeof ceremony.endTime === "string" &&
                            /^\d{2}:\d{2}$/.test(ceremony.endTime))) && (
                          <>
                            {" | Fim: "}
                            {ceremony.endTime instanceof Date
                              ? ceremony.endTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ceremony.endTime}
                          </>
                        )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingCeremony(ceremony)}
                      aria-label="Editar"
                    >
                      <FilePen />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteCeremony(ceremony.id)}
                      aria-label="Excluir"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-muted-foreground text-center py-8">
              Nenhuma cerimônia encontrada.
            </div>
          )}
        </div>
      )}
      {editingCeremony && (
        <CeremonyDialogForm
          ceremony={editingCeremony}
          onClose={() => setEditingCeremony(null)}
        />
      )}
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </>
  );
}
