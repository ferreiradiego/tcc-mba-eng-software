"use client";

import {
  ControlledCheckbox,
  ControlledInput,
  ControlledSelect,
  ControlledTextArea,
} from "@/components/controlled-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSprints } from "@/hooks/use-sprints";
import { UserStory, useUserStories } from "@/hooks/use-user-stories";
import { USER_STORY_STATUS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const UserStorySchema = z.object({
  title: z.string().min(2, "Título obrigatório"),
  status: z.string(),
  description: z.string().optional(),
  sprintId: z.string().optional(),
  blocked: z.boolean().optional(),
});

type UserStoryForm = z.infer<typeof UserStorySchema>;

export function UserStoryDialogForm({
  userStory,
  onClose,
}: {
  userStory?: UserStory;
  onClose?: () => void;
}) {
  const isEdit = !!userStory;
  const [open, setOpen] = useState(false);
  const { createUserStory, updateUserStory } = useUserStories();
  const { sprints } = useSprints();
  const methods = useForm<UserStoryForm>({
    resolver: zodResolver(UserStorySchema),
    defaultValues: userStory
      ? {
          ...userStory,
        }
      : {},
  });

  useEffect(() => {
    if (isEdit && userStory) {
      setOpen(true);
      methods.reset({
        ...userStory,
      });
    }
  }, [userStory]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  async function onSubmit(data: UserStoryForm) {
    const payload = {
      ...data,
    };
    if (isEdit && userStory) {
      await updateUserStory.mutateAsync({ id: userStory.id, data: payload });
    } else {
      await createUserStory.mutateAsync(payload);
    }
    methods.reset();
    setOpen(false);
    onClose?.();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!isEdit && (
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
            <PlusIcon />
            Adicionar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar User Story" : "Nova User Story"}
          </DialogTitle>
        </DialogHeader>
        {methods.formState.isSubmitting ? (
          <div className="py-8 text-center text-muted-foreground">
            Salvando user story...
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <ControlledInput name="title" label="Título" required />
              <ControlledTextArea name="description" label="Descrição" />
              <ControlledSelect
                name="status"
                label="Status"
                required
                options={USER_STORY_STATUS}
              />
              <ControlledSelect
                name="sprintId"
                label="Sprint"
                options={[
                  ...sprints.map((s) => ({
                    value: s.id,
                    label: s.name,
                  })),
                ]}
              />
              <ControlledCheckbox name="blocked" label="Bloqueada" />
              <Button
                type="submit"
                disabled={methods.formState.isSubmitting}
                className="w-full"
              >
                {methods.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
