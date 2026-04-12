import {
    LogOut,
    Settings,
    User,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserAccountMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* Botón que combina Avatar + Texto "Perfil" para desktop */}
                <Button variant="ghost" className="relative h-10 w-full flex items-center justify-start gap-2 px-2 md:w-auto">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="@usuario" />
                        <AvatarFallback>MP</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Perfil</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Mi Cuenta</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            usuario@email.com
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Mi perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuración</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}