import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CeremoniesPage() {
  // TODO: Integrar com API de cerimônias
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cerimônias Scrum</h2>
        <Button>Novo</Button>
      </div>
      <Card className="p-4">
        <div className="divide-y">
          {/* Listagem de cerimônias */}
          <div className="py-2 flex items-center justify-between">
            <span className="font-medium">Exemplo de cerimônia</span>
            <Button variant="outline" size="sm">Ver</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
