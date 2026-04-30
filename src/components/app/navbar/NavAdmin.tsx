import { UsersIcon, LineChartIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function NavAdmin() {
  const { t } = useTranslation();

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
  
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "gap-2")}
          >
            <Link to="/admin/users">
              <UsersIcon className="size-4" />
              <span>{t("NAVBAR.MOBILE_NAV.MANAGE_USERS")}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "gap-2")}
          >
            <Link to="/admin/statistics">
              <LineChartIcon className="size-4" />
              <span>{t("NAVBAR.MOBILE_NAV.STATISTICS")}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
