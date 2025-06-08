import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function TasksPage() {
  // TODO: Integrar com API de tasks
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tarefas</h2>
        <Button>Novo</Button>
      </div>
      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <Input placeholder="Buscar tarefa..." />
        </div>
        <div className="divide-y">
          {/* Listagem de tarefas */}
          <div className="py-2 flex items-center justify-between">
            <span className="font-medium">Exemplo de tarefa</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="destructive" size="sm">Excluir</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
