import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
    defaultView?: "login" | "signup";
    trigger: React.ReactNode;
}

export function AuthModal({ defaultView = "login", trigger }: AuthModalProps) {
    const [view, setView] = useState<"login" | "signup">(defaultView);

    return (
        <Dialog onOpenChange={() => setView(defaultView)}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">
                        {view === "login" ? (<div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold tracking-tight">Iniciar Sesión</h1>
                            <p className="text-sm text-muted-foreground">
                                Introduce tus credenciales para acceder
                            </p>
                        </div>) : (<div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
                            <p className="text-sm text-muted-foreground">
                                Introduce tus credenciales para registrarte
                            </p>
                        </div>)}
                    </DialogTitle>
                </DialogHeader>

                {view === "login" ? (
                    <div className="space-y-4">
                        <LoginForm />
                        <p className="text-center text-sm">
                            ¿No tienes cuenta?{" "}
                            <button
                                onClick={() => setView("signup")}
                                className="text-primary hover:underline font-medium"
                            >
                                Regístrate
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <SignupForm />
                        <p className="text-center text-sm">
                            ¿Ya tienes cuenta?{" "}
                            <button
                                onClick={() => setView("login")}
                                className="text-primary hover:underline font-medium"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}