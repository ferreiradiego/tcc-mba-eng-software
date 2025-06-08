import CeremoniesList from "@/components/ceremonies-list";
import { CeremonyDialogForm } from "@/components/ceremony-dialog-form";
import { Card } from "@/components/ui";

export default function CeremoniesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cerimônias Scrum</h2>
        <CeremonyDialogForm />
      </div>
      <Card className="p-4">
        <CeremoniesList />
      </Card>
    </div>
  );
}
