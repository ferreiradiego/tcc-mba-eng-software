"use client";

import { CeremonyDialogForm } from "@/components/ceremony-dialog-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Ceremony, useCeremonies } from "@/hooks/use-ceremonies";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { cn } from "@/lib/utils";
import {
  addDays,
  format,
  format as formatDate,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarCheck2, Clock, FilePen, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

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

  const { filters, clearFilters, updatePath } = useUrlFilters([
    "type",
    "status",
    "dateFrom",
    "dateTo",
  ]);

  const [typeFilter, setTypeFilter] = useState<string>(filters.type || "ALL");
  const [statusFilter, setStatusFilter] = useState<string>(
    filters.status || "ALL"
  );
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>(() => {
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;
    return { from, to };
  });

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

  const filteredCeremonies = ceremonies.filter((ceremony) => {
    const isDone =
      ceremony.scheduledAt && new Date(ceremony.scheduledAt) <= new Date();
    const typeMatch = typeFilter === "ALL" || ceremony.type === typeFilter;
    const statusMatch =
      statusFilter === "ALL" ||
      (statusFilter === "REALIZADA" && isDone) ||
      (statusFilter === "PENDENTE" && !isDone);
    const scheduledDate = ceremony.scheduledAt
      ? new Date(ceremony.scheduledAt)
      : null;
    let dateMatch = true;
    if (dateRange.from && dateRange.to && scheduledDate) {
      dateMatch =
        (isSameDay(scheduledDate, dateRange.from) ||
          isAfter(scheduledDate, dateRange.from)) &&
        (isSameDay(scheduledDate, dateRange.to) ||
          isBefore(scheduledDate, addDays(dateRange.to, 1)));
    } else if (dateRange.from && scheduledDate) {
      dateMatch =
        isSameDay(scheduledDate, dateRange.from) ||
        isAfter(scheduledDate, dateRange.from);
    }
    return typeMatch && statusMatch && dateMatch;
  });

  useEffect(() => {
    const { from, to } = dateRange;
    const query: Record<string, string> = {};
    if (typeFilter && typeFilter !== "ALL") query.type = typeFilter;
    if (statusFilter && statusFilter !== "ALL") query.status = statusFilter;
    if (from) query.dateFrom = from.toISOString().slice(0, 10);
    if (to) query.dateTo = to.toISOString().slice(0, 10);
    const params = new URLSearchParams(query).toString();

    updatePath(params);
  }, [typeFilter, statusFilter, dateRange, updatePath]);

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os tipos</SelectItem>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="PLANNING">Planning</SelectItem>
              <SelectItem value="REVIEW">Review</SelectItem>
              <SelectItem value="RETROSPECTIVE">Retrospective</SelectItem>
              <SelectItem value="OTHER">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="REALIZADA">Realizada</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[220px] justify-start text-left font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground"
                )}
              >
                {dateRange.from && dateRange.to
                  ? `${formatDate(dateRange.from, "P", {
                      locale: ptBR,
                    })} - ${formatDate(dateRange.to, "P", { locale: ptBR })}`
                  : dateRange.from
                  ? formatDate(dateRange.from, "P", { locale: ptBR })
                  : "Filtrar por período"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={
                  dateRange.from && dateRange.to
                    ? { from: dateRange.from, to: dateRange.to }
                    : undefined
                }
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from ?? null,
                    to: range?.to ?? null,
                  })
                }
                required={false}
              />
              {(dateRange.from || dateRange.to) && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={() => {
                    setDateRange({ from: null, to: null });
                    clearFilters();
                  }}
                >
                  Limpar filtro
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="ghost"
          className="h-9"
          onClick={() => {
            setTypeFilter("ALL");
            setStatusFilter("ALL");
            setDateRange({ from: null, to: null });
            clearFilters();
          }}
        >
          Limpar todos os filtros
        </Button>
      </div>

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
          {filteredCeremonies.length > 0 ? (
            filteredCeremonies.map((ceremony) => {
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

      {filteredCeremonies.length > 0 && (
        <div className="flex items-center justify-start mt-4 text-base text-purple-900 font-medium gap-2 border-t pt-4">
          Tempo total das cerimônias:
          <span>
            {formatDuration(
              filteredCeremonies.reduce((acc, c) => acc + (c.duration || 0), 0)
            )}
          </span>
        </div>
      )}
    </>
  );
}
