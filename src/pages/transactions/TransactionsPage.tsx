import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Transacciones</h1>
        {/* The AddTransaction Modal trigger will go here */}
        <Button>Añadir Movimiento</Button>
      </div>
      <div className="h-96 border rounded-lg bg-card flex items-center justify-center text-muted-foreground">
        Lista de transacciones (Mock)
      </div>
    </div>
  );
}