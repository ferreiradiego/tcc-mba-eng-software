import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TimeLogsPage() {
  // TODO: Integrar com API de timelogs
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Registro de Tempo</h2>
        <Button>Novo Registro</Button>
      </div>
      <Card className="p-4">
        <div className="divide-y">
          {/* Listagem de registros de tempo */}
          <div className="py-2 flex items-center justify-between">
            <span className="font-medium">Exemplo de registro</span>
            <Button variant="outline" size="sm">Editar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
