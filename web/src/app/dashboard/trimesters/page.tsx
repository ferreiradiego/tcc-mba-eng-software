"use client";

import { SprintForm } from "@/components/sprint-form";
import { TrimesterForm } from "@/components/trimester-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTrimesters } from "@/hooks/use-trimesters";
import { useSprints } from "@/hooks/use-sprints";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

export default function TrimestersSprintsPage() {
  const [openTrimester, setOpenTrimester] = useState(false);
  const [openSprint, setOpenSprint] = useState<string | null>(null);
  const [loadingTrimester, setLoadingTrimester] = useState(false);
  const [loadingSprint, setLoadingSprint] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [editTrimester, setEditTrimester] = useState<any | null>(null);
  const [editSprint, setEditSprint] = useState<any | null>(null);

  const {
    trimesters,
    loading: loadingList,
    error: errorList,
    createTrimester,
    deleteTrimester,
    updateTrimester,
  } = useTrimesters();
  const {
    sprints,
    createSprint,
    deleteSprint,
    updateSprint,
    loading: loadingSprints,
    error: errorSprints,
  } = useSprints();

  async function handleTrimester(data: { year: number; number: number }) {
    setLoadingTrimester(true);
    try {
      await createTrimester(data);
      toast("Trimestre cadastrado! Agora cadastre sprints.");
      setOpenTrimester(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
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
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
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
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Erro ao editar trimestre"
      );
    } finally {
      setLoadingTrimester(false);
    }
  }

  async function handleEditSprint(
    data: { name: string; startDate: string; endDate: string }
  ) {
    if (!editSprint) return;
    setLoadingSprint(true);
    try {
      await updateSprint({
        id: editSprint.id,
        data: { ...data, trimesterId: editSprint.trimesterId },
      });
      toast("Sprint atualizada!");
      setEditSprint(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
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
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
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
    <div className="max-w-2xl mx-auto space-y-8 mt-8">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Trimestres cadastrados</h2>
          <Dialog open={openTrimester} onOpenChange={handleOpenTrimester}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Novo Trimestre
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
          {/* Editar Trimestre Dialog */}
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
                initialValues={editTrimester}
              />
            </DialogContent>
          </Dialog>
        </div>
        {loadingList ? (
          <div>Carregando...</div>
        ) : errorList ? (
          <div className="text-red-500">{errorList}</div>
        ) : trimesters.length === 0 ? (
          <div className="text-gray-500">Nenhum trimestre cadastrado.</div>
        ) : (
          <ul className="space-y-4">
            {trimesters.map((t: any) => (
              <li key={t.id} className="border rounded p-3 bg-muted">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    {t.year} - {t.number}º trimestre
                  </div>
                  <div className="flex gap-2">
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
                  {sprints.filter((s: any) => s.trimesterId === t.id).length >
                  0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {sprints
                        .filter((s: any) => s.trimesterId === t.id)
                        .map((s: any) => (
                          <div
                            key={s.id}
                            className="rounded border bg-white p-2 flex items-center justify-between shadow-sm"
                          >
                            <div>
                              <span className="font-medium">{s.name}</span>
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {format(new Date(s.startDate), "P", { locale: ptBR })} -{" "}
                                {format(new Date(s.endDate), "P", { locale: ptBR })}
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
                                  } catch (err: any) {
                                    toast.error(
                                      err?.response?.data?.message ||
                                        err.message ||
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
      </Card>
      {/* Editar Sprint Dialog */}
      <Dialog open={!!editSprint} onOpenChange={(v) => !v && setEditSprint(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sprint</DialogTitle>
          </DialogHeader>
          <SprintForm
            onSubmit={handleEditSprint}
            loading={loadingSprint}
            initialValues={editSprint}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
