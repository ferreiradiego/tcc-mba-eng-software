"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";

export function TimeLogDialogForm({
  timelog,
  onClose,
}: {
  timelog?: any;
  onClose?: () => void;
}) {
  const isEdit = !!timelog;
  const [open, setOpen] = useState(false);
  const { user } = useCurrentUser();
  const { tasks } = useTasks();

  useEffect(() => {
    if (isEdit && timelog) {
      setOpen(true);
    }
  }, [timelog]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!isEdit && (
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
            <PlusIcon />
            Adicionar
          </Button>
        )}
      </DialogTrigger>{" "}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Registro" : "Novo Registro de Tempo"}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
