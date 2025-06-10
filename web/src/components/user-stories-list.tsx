"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStories, type UserStory } from "@/hooks/use-user-stories";
import { FilePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { UserStoryDialogForm } from "./user-story-dialog-form";

export default function UserStoriesList() {
  const { userStories, loading, error, deleteUserStory } = useUserStories();
  const [editingUserStory, setEditingUserStory] = useState<UserStory | null>(
    null
  );

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
        <div className="divide-y">
          {userStories.map((story) => (
            <div
              key={story.id}
              className="py-2 flex items-center justify-between"
            >
              <span className="font-medium">{story.title}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingUserStory(story)}
                >
                  <FilePen />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteUserStory.mutate(story.id)}
                >
                  <Trash2 />
                </Button>
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
