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
import CheckEmailView from "./CheckEmailView";
import { useTranslation } from "react-i18next";

interface AuthModalProps {
    defaultView?: "login" | "signup";
    trigger: React.ReactNode;
}

export function AuthModal({ defaultView = "login", trigger }: AuthModalProps) {
    const [view, setView] = useState<"login" | "signup" | "check-email">(defaultView);
    const { t } = useTranslation();

    return (
        <Dialog onOpenChange={() => setView(defaultView)}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>
                        {view === "login" && t('AUTH_MODAL.LOGIN_TITLE')}
                        {view === "signup" && t('AUTH_MODAL.SIGNUP_TITLE')}
                        {view === "check-email" && t('AUTH_MODAL.CHECK_EMAIL_TITLE')}
                    </DialogTitle>
                </DialogHeader>

                {view === "login" && (
                    <div className="space-y-4">
                        <LoginForm />
                        <p className="text-center text-sm">
                            {t('AUTH_MODAL.NO_ACCOUNT')}{" "}
                            <button
                                onClick={() => setView("signup")}
                                className="text-primary hover:underline font-medium"
                            >
                                {t('AUTH_MODAL.SIGN_UP')}
                            </button>
                        </p>
                    </div>
                )}

                {view == "signup" && (
                    <div className="space-y-4">
                        <SignupForm onSuccess={() => setView("check-email")} />
                        <p className="text-center text-sm">
                            {t('AUTH_MODAL.HAVE_ACCOUNT')}{" "}
                            <button
                                onClick={() => setView("login")}
                                className="text-primary hover:underline font-medium"
                            >
                                {t('AUTH_MODAL.SIGN_IN')}
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