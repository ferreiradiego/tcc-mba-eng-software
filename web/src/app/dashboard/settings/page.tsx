import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  // TODO: Integrar com API de configurações de usuário
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações do Usuário</h2>
      <Card className="p-4 space-y-4">
        <div>
          <span className="font-medium">Notificações</span>
          <div className="flex gap-4 mt-2">
            <Button variant="outline">E-mail</Button>
            <Button variant="outline">SMS</Button>
            <Button variant="outline">Push</Button>
          </div>
        </div>
        <div>
          <span className="font-medium">Conta</span>
          <div className="flex gap-4 mt-2">
            <Button variant="destructive">Excluir Conta</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
