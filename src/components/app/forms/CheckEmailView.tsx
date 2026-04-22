import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckEmailViewProps {
    onLoginClick: () => void;
}

export default function CheckEmailView({ onLoginClick }: CheckEmailViewProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
            <div className="bg-primary/10 p-4 rounded-full">
                <Mail className="w-12 h-12 text-primary" />
            </div>

            <h2 className="text-xl font-bold">¡Revisa tu correo!</h2>

            <p className="text-sm text-muted-foreground">
                Por favor, revisa tu bandeja de entrada para verificar tu cuenta antes de iniciar sesión.
            </p>

            <Button onClick={onLoginClick} className="w-full mt-4">
                Volver al inicio de sesión
            </Button>
        </div>
    );
}