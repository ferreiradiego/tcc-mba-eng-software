"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useUserStories, type UserStory } from "@/hooks/use-user-stories";
import { FilePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { UserStoryDialogForm } from "./user-story-dialog-form";

export default function UserStoriesList() {
  const { userStories, loading, error, deleteUserStory } = useUserStories();
  const [editingUserStory, setEditingUserStory] = useState<UserStory | null>(
    null
  );

  const grouped = userStories.reduce<
    Record<string, Record<string, UserStory[]>>
  >((acc, us) => {
    const sprint = us.sprint;
    const trimester =
      sprint && sprint.trimester
        ? `${sprint.trimester.number}/${sprint.trimester.year}`
        : "Sem Trimestre";
    const sprintName = sprint ? sprint.name : "Sem Sprint";
    if (!acc[trimester]) acc[trimester] = {};
    if (!acc[trimester][sprintName]) acc[trimester][sprintName] = [];
    acc[trimester][sprintName].push(us);
    return acc;
  }, {});

  const statusMap: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "outline" | "destructive";
    }
  > = {
    TODO: { label: "A Fazer", variant: "secondary" },
    IN_PROGRESS: { label: "Em Progresso", variant: "outline" },
    DONE: { label: "Concluída", variant: "default" },
    BLOCKED: { label: "Bloqueada", variant: "destructive" },
  };

  return (
    <>
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <Skeleton className="h-5 w-1/3 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([trimesterLabel, sprints]) => (
            <div
              key={trimesterLabel}
              className="mb-6 rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-primary">
                  {trimesterLabel}
                </span>
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 rounded"
                >
                  {Object.values(sprints).reduce(
                    (acc, arr) => acc + arr.length,
                    0
                  )}{" "}
                  US
                </Badge>
              </div>
              <div className="space-y-6 ml-2">
                {Object.entries(sprints).map(([sprintName, stories]) => (
                  <div key={sprintName} className="mb-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-muted-foreground">
                        {sprintName}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 rounded"
                      >
                        {stories.length} US
                      </Badge>
                    </div>
                    <div className="divide-y rounded-md border bg-background">
                      {stories.map((story) => (
                        <div
                          key={story.id}
                          className="py-5 flex items-center justify-between px-3 hover:bg-muted/60 transition-colors rounded-md"
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-base text-primary">
                                {story.title}
                              </span>
                              {story.blocked && (
                                <Badge
                                  variant="destructive"
                                  className="px-2 py-0.5 rounded"
                                >
                                  Bloqueada
                                </Badge>
                              )}
                            </div>

                            {story.activationDate && (
                              <span className="text-xs text-muted-foreground">
                                Ativada em:{" "}
                                {new Date(
                                  story.activationDate
                                ).toLocaleDateString("pt-BR")}
                              </span>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  statusMap[story.status]?.variant || "default"
                                }
                                className="px-2 py-0.5 rounded"
                              >
                                {statusMap[story.status]?.label || story.status}
                              </Badge>
                              {story.sprint?.startDate && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    story.sprint.startDate
                                  ).toLocaleDateString("pt-BR")}
                                  {story.sprint.endDate
                                    ? ` - ${new Date(
                                        story.sprint.endDate
                                      ).toLocaleDateString("pt-BR")}`
                                    : ""}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingUserStory(story)}
                              aria-label="Editar user story"
                              className="border-muted-foreground/30 hover:border-primary"
                            >
                              <FilePen className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => deleteUserStory.mutate(story.id)}
                              aria-label="Excluir user story"
                              className="hover:bg-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {userStories.length === 0 && (
            <div className="text-muted-foreground text-center py-8">
              Nenhuma user story encontrada.
            </div>
          )}
        </div>
      )}

      {editingUserStory && (
        <UserStoryDialogForm
          userStory={editingUserStory}
          onClose={() => setEditingUserStory(null)}
        />
      )}

      {error && (
        <div className="text-red-500 text-sm text-center">{error.message}</div>
      )}
    </>
  );
}
