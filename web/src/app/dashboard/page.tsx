import DashboardSummary from "@/components/dashboard-summary";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardSummary />
    </div>
  );
}
