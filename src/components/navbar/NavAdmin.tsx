import {
    UsersIcon,
    LineChartIcon,
} from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function NavAdmin() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-1">

                {/* Gestión de Usuarios */}
                <NavigationMenuItem>
                    <NavigationMenuLink
                        href="/admin/users"
                        className={cn(navigationMenuTriggerStyle(), "gap-2")}
                    >
                        <UsersIcon className="size-4" />
                        <span>Gestión Usuarios</span>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Estadísticas Globales */}
                <NavigationMenuItem>
                    <NavigationMenuLink
                        href="/admin/stats"
                        className={cn(navigationMenuTriggerStyle(), "gap-2")}
                    >
                        <LineChartIcon className="size-4" />
                        <span>Estadísticas</span>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Badge visual de Admin */}
                <div className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                    Admin Mode
                </div>

            </NavigationMenuList>
        </NavigationMenu>
    );
}