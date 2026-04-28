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
                <Button variant="ghost" size="default" className="size-9 w-auto mx-5">
                    <Languages />
                    {description && <span className="ml-3">Cambiar Idioma</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log("Cambiando a ES")}>
                    Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Cambiando a EN")}>
                    English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}