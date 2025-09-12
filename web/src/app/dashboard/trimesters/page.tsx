"use client";

import { SprintForm } from "@/components/sprint-form";
import { TrimesterForm } from "@/components/trimester-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSprints, Sprint } from "@/hooks/use-sprints";
import { useTrimesters, Trimester } from "@/hooks/use-trimesters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Plus, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ErrorMessage = {
  response?: { data?: { message?: string } };
  message?: string;
};

export default function TrimestersSprintsPage() {
  const [openTrimester, setOpenTrimester] = useState(false);
  const [openSprint, setOpenSprint] = useState<string | null>(null);
  const [loadingTrimester, setLoadingTrimester] = useState(false);
  const [loadingSprint, setLoadingSprint] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [editTrimester, setEditTrimester] = useState<Trimester | null>(null);
  const [editSprint, setEditSprint] = useState<Sprint | null>(null);

  const {
    trimesters,
    loading: loadingList,
    error: errorList,
    createTrimester,
    deleteTrimester,
    updateTrimester,
  } = useTrimesters();
  const { sprints, createSprint, deleteSprint, updateSprint } = useSprints();

  async function handleTrimester(data: { year: number; number: number }) {
    setLoadingTrimester(true);
    try {
      await createTrimester(data);
      toast("Trimestre cadastrado! Agora cadastre sprints.");
      setOpenTrimester(false);
    } catch (err) {
      const error = err as ErrorMessage;
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao cadastrar trimestre",
        {}
      );
    } finally {
      setLoadingTrimester(false);
    }
  }

  async function handleSprint(
    data: { name: string; startDate: string; endDate: string },
    trimesterId: string
  ) {
    setLoadingSprint(true);
    try {
      await createSprint({ ...data, trimesterId });
      toast("Sprint cadastrada com sucesso!");
      setOpenSprint(null);
    } catch (err) {
      const error = err as ErrorMessage;
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao cadastrar sprint"
      );
    } finally {
      setLoadingSprint(false);
    }
  }

  async function handleEditTrimester(data: { year: number; number: number }) {
    if (!editTrimester) return;
    setLoadingTrimester(true);
    try {
      await updateTrimester({ id: editTrimester.id, data });
      toast("Trimestre atualizado!");
      setEditTrimester(null);
    } catch (err) {
      const error = err as ErrorMessage;
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao editar trimestre"
      );
    } finally {
      setLoadingTrimester(false);
    }
  }

  async function handleEditSprint(data: {
    name: string;
    startDate: string;
    endDate: string;
  }) {
    if (!editSprint) return;
    setLoadingSprint(true);
    try {
      await updateSprint({
        id: editSprint.id,
        data: { ...data, trimesterId: editSprint.trimesterId },
      });
      toast("Sprint atualizada!");
      setEditSprint(null);
    } catch (err) {
      const error = err as ErrorMessage;
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao editar sprint"
      );
    } finally {
      setLoadingSprint(false);
    }
  }

  async function handleDeleteTrimester(id: string) {
    setLoadingDelete(true);
    try {
      await deleteTrimester(id);
      toast("Trimestre deletado com sucesso!");
    } catch (err) {
      const error = err as ErrorMessage;
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao deletar trimestre"
      );
    } finally {
      setLoadingDelete(false);
    }
  }

  function handleOpenTrimester(open: boolean) {
    setOpenTrimester(open);
  }
  function handleOpenSprint(id: string | null) {
    setOpenSprint(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trimestres & Sprints</h1>
        <Dialog open={openTrimester} onOpenChange={handleOpenTrimester}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
              <PlusIcon />
              Novo trimestre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Trimestre</DialogTitle>
            </DialogHeader>
            <TrimesterForm
              onSubmit={handleTrimester}
              loading={loadingTrimester}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!editTrimester}
          onOpenChange={(v) => !v && setEditTrimester(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Trimestre</DialogTitle>
            </DialogHeader>
            <TrimesterForm
              onSubmit={handleEditTrimester}
              loading={loadingTrimester}
              initialValues={editTrimester ?? undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loadingList ? (
        <ul className="space-y-4">
          {[1, 2].map((_, i) => (
            <li key={i} className="border rounded p-3 bg-muted">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-40" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {[1, 2].map((_, j) => (
                  <div
                    key={j}
                    className="rounded border bg-white p-2 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : errorList ? (
        <div className="text-red-500">{errorList}</div>
      ) : trimesters.length === 0 ? (
        <div className="text-gray-500">Nenhum trimestre cadastrado.</div>
      ) : (
        <ul className="space-y-4">
          {trimesters.map((t: Trimester) => (
            <li key={t.id} className="border rounded p-3 bg-muted">
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  {t.year} - {t.number}º trimestre
                </div>
                <div className="flex gap-2 pr-2">
                  <Dialog
                    open={openSprint === t.id}
                    onOpenChange={(v) => handleOpenSprint(v ? t.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Sprint
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cadastrar Sprint</DialogTitle>
                      </DialogHeader>
                      <SprintForm
                        onSubmit={(data) => handleSprint(data, t.id)}
                        loading={loadingSprint}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Editar trimestre"
                    onClick={() => setEditTrimester(t)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-100"
                    title="Deletar trimestre"
                    onClick={() => handleDeleteTrimester(t.id)}
                    disabled={loadingDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {/* Sprints List UX */}
              <div className="mt-2">
                {sprints.filter((s: Sprint) => s.trimesterId === t.id).length >
                0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {sprints
                      .filter((s: Sprint) => s.trimesterId === t.id)
                      .map((s: Sprint) => (
                        <div
                          key={s.id}
                          className="rounded border bg-white p-2 flex items-center justify-between shadow-sm"
                        >
                          <div>
                            <span className="font-medium">{s.name}</span>
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {format(new Date(s.startDate), "P", {
                                locale: ptBR,
                              })}{" "}
                              -{" "}
                              {format(new Date(s.endDate), "P", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Editar sprint"
                              onClick={() => setEditSprint(s)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Deletar sprint"
                              className="text-red-600 hover:bg-red-100"
                              onClick={async () => {
                                setLoadingSprint(true);
                                try {
                                  await deleteSprint(s.id);
                                  toast("Sprint deletada!");
                                } catch (err) {
                                  const error = err as ErrorMessage;
                                  toast.error(
                                    error?.response?.data?.message ||
                                      error?.message ||
                                      "Erro ao deletar sprint"
                                  );
                                } finally {
                                  setLoadingSprint(false);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    Nenhuma sprint cadastrada.
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Dialog
        open={!!editSprint}
        onOpenChange={(v) => !v && setEditSprint(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sprint</DialogTitle>
          </DialogHeader>
          <SprintForm
            onSubmit={handleEditSprint}
            loading={loadingSprint}
            initialValues={editSprint ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
