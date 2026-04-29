import {
  PlusCircle,
  BarChart3,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../ui/navigation-menu";
import { TransactionModal } from "../forms/TransactionModal";
import { useTranslation } from "react-i18next";

export function NavUser() {
  const { t } = useTranslation();
      
  return (
    <NavigationMenu viewport={false} className="relative">
      <NavigationMenuList>
        <NavigationMenuItem>
          <TransactionModal
            trigger={
              /* We use asChild on the Modal Trigger and then asChild on the MenuLink 
                               to ensure the final HTML is just a button with your styles */
              <NavigationMenuLink
                asChild
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none cursor-pointer"
              >
                <div role="button">
                  <PlusCircle className="mr-2 h-4 w-4 text-primary" />
                  {t('NAVBAR.MOBILE_NAV.ADD_TRANSACTION')}
                </div>
              </NavigationMenuLink>
            }
          />
        </NavigationMenuItem>

        {/* Dropdown: Mis Transacciones */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t('NAVBAR.NAV_USER.MY_TRANSACTIONS')}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-1 p-2">
              <ListItem
                href="/transactions/day"
                title={t('NAVBAR.MOBILE_NAV.DAILY')}
                icon={<CalendarCheck className="size-4" />}
              />
              <ListItem
                href="/transactions/month"
                title={t('NAVBAR.MOBILE_NAV.MONTHLY')}
                icon={<CalendarDays className="size-4" />}
              />
              <ListItem
                href="/transactions/year"
                title={t('NAVBAR.MOBILE_NAV.YEARLY')}
                icon={<CalendarRange className="size-4" />}
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Dropdown: Gráficas */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t('NAVBAR.MOBILE_NAV.GRAPHS')}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-1 p-2">
              <ListItem
                href="/graphs/month"
                title={t('NAVBAR.MOBILE_NAV.MONTHLY')}
                icon={<BarChart3 className="size-4" />}
              />
              <ListItem
                href="/graphs/year"
                title={t('NAVBAR.MOBILE_NAV.YEARLY')}
                icon={<BarChart3 className="size-4" />}
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// Componente auxiliar para los items del menú
const ListItem = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
}) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        href={href}
        className="flex items-center gap-3 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        {icon}
        <div className="text-sm font-medium leading-none">{title}</div>
      </a>
    </NavigationMenuLink>
  </li>
);
