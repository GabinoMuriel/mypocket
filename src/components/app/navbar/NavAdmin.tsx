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
import { useTranslation } from "react-i18next";

export function NavAdmin() {
    const { t } = useTranslation();

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
                        <span>{t('NAVBAR.MOBILE_NAV.MANAGE_USERS')}</span>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Estadísticas Globales */}
                <NavigationMenuItem>
                    <NavigationMenuLink
                        href="/admin/statistics"
                        className={cn(navigationMenuTriggerStyle(), "gap-2")}
                    >
                        <LineChartIcon className="size-4" />
                        <span>{t('NAVBAR.MOBILE_NAV.STATISTICS')}</span>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Badge visual de Admin */}
                {/* <div className="ml-2 px-2 py-0.5 rounded-full bg-[var(--admin-background)] text-[var(--admin)] border border-[var(--admin)] text-[10px] font-bold uppercase tracking-wider">
                    Admin
                </div> */}

            </NavigationMenuList>
        </NavigationMenu>
    );
}