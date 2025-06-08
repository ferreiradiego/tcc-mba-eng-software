import { TimeLogDialogForm } from "@/components/timelog-dialog-form";
import TimeLogsList from "@/components/timelogs-list";
import { Card } from "@/components/ui/card";

export default function TimeLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Registro de Tempo</h2>
        <TimeLogDialogForm />
      </div>
      <Card className="p-4">
        <TimeLogsList />
      </Card>
    </div>
  );
}
