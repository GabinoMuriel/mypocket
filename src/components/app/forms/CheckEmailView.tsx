import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface CheckEmailViewProps {
    onLoginClick: () => void;
}

export default function CheckEmailView({ onLoginClick }: CheckEmailViewProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
            <div className="bg-primary/10 p-4 rounded-full">
                <Mail className="w-12 h-12 text-primary" />
            </div>

            <h2 className="text-xl font-bold">{t('AUTH_FORMS.CHECK_EMAIL.TITLE')}</h2>

            <p className="text-sm text-muted-foreground">
                {t('AUTH_FORMS.CHECK_EMAIL.DESC')}
            </p>

            <Button onClick={onLoginClick} className="w-full mt-4">
                {t('AUTH_FORMS.CHECK_EMAIL.BACK_TO_LOGIN')}
            </Button>
        </div>
    );
}