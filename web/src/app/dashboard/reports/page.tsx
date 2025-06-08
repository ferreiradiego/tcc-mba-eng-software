import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  // TODO: Integrar com API de relatórios
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Relatórios</h2>
        <Button>Gerar Relatório</Button>
      </div>
      <Card className="p-4">
        <div className="divide-y">
          {/* Listagem de relatórios ou opções de exportação */}
          <div className="py-2 flex items-center justify-between">
            <span className="font-medium">Exemplo de relatório</span>
            <Button variant="outline" size="sm">Exportar PDF</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
