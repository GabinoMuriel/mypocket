import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface LanguageToggleProps {
    description?: boolean;
}

export function LanguageToggle({ description = false }: LanguageToggleProps) {

    const { t, i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className="size-9 w-auto">
                    <Languages />
                    {description && <span className="ml-3">Cambiar Idioma</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("es")}>
                    <img
                        src="/assets/flags/es.svg"
                        alt="Spanish"
                        className="w-4 h-3"
                    />
                    <span>{t('NAVBAR.LANGUAGES.SPANISH')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    <img
                        src="/assets/flags/gb.svg"
                        alt="English"
                        className="w-4 h-3"
                    />
                    <span>{t('NAVBAR.LANGUAGES.ENGLISH')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("zh")}>
                    <img
                        src="/assets/flags/cn.svg"
                        alt="Chinese"
                        className="w-4 h-3"
                    />
                    <span>{t('NAVBAR.LANGUAGES.CHINESE')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}