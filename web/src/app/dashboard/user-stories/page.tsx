import { Card } from "@/components/ui";
import UserStoriesList from "@/components/user-stories-list";
import { UserStoryDialogForm } from "@/components/user-story-dialog-form";

export default function UserStoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Stories</h1>
        <UserStoryDialogForm />
      </div>
      <Card className="p-4">
        <UserStoriesList />
      </Card>
    </div>
  );
}
