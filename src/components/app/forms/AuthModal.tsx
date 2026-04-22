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
import { Check } from "lucide-react";
import CheckEmailView from "./CheckEmailView";

interface AuthModalProps {
    defaultView?: "login" | "signup";
    trigger: React.ReactNode;
}

export function AuthModal({ defaultView = "login", trigger }: AuthModalProps) {
    const [view, setView] = useState<"login" | "signup" | "check-email">(defaultView);

    return (
        <Dialog onOpenChange={() => setView(defaultView)}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {view === "login" && "Iniciar sesión"}
                        {view === "signup" && "Crear cuenta"}
                        {view === "check-email" && "Verificación requerida"}
                    </DialogTitle>
                </DialogHeader>

                {view === "login" && (
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
                )}

                {view == "signup" && (
                    <div className="space-y-4">
                        <SignupForm onSuccess={() => setView("check-email")} />
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

                {view == "check-email" && (
                    <div className="space-y-4">
                        <CheckEmailView onLoginClick={() => setView("login")} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}