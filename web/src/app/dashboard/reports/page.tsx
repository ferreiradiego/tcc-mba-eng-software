import ReportsSummary from "@/components/reports-summary";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Relatórios</h2>
      </div>
      <ReportsSummary />
    </div>
  );
}
