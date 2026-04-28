import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageToggleProps {
    description?: boolean;
}

export function LanguageToggle({ description = false }: LanguageToggleProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className="size-9 w-auto">
                    <Languages />
                    {description && <span className="ml-3">Cambiar Idioma</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log("Changing language to Spanish")}>
                    <img
                        src="/assets/flags/es.svg"
                        alt="Spanish"
                        className="w-4 h-3"
                    />
                    <span>Español</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Changing language to English")}>
                    <img
                        src="/assets/flags/gb.svg"
                        alt="Spanish"
                        className="w-4 h-3"
                    />
                    <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Changing language to Chinese")}>
                    <img
                        src="/assets/flags/cn.svg"
                        alt="Spanish"
                        className="w-4 h-3"
                    />
                    <span>Chinese</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}