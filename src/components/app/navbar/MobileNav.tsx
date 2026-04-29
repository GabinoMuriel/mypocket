import { Menu, PlusCircle } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TransactionModal } from "../forms/TransactionModal";
import { Logo } from "../Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { AuthModal } from "../forms/AuthModal";
import { useTranslation } from "react-i18next";

export function MobileNav({ isLogged, isAdmin }: { isLogged: boolean; isAdmin: boolean }) {
    const { t } = useTranslation();

    return (
        <Sheet>
            <SheetTrigger asChild>
                {/* Este es el botón que ahora sí verás en móvil */}
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="size-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle className="text-left"><Logo /></SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 py-6">
                    {/* Lógica de links según el estado */}
                    {!isLogged ? (
                        <>
                            <a href="#" className="text-lg font-semibold pl-8">{t('NAVBAR.MOBILE_NAV.HOME')}</a>
                            <Separator />
                            <ThemeToggle description={true} />
                            <LanguageToggle description={true} />
                            <Separator />
                            {/* MODAL PARA LOGIN */}
                            <AuthModal
                                defaultView="login"
                                trigger={<Button variant="outline" size="sm" className="mx-5">{t('NAVBAR.MOBILE_NAV.LOGIN')}</Button>}
                            />

                            {/* MODAL PARA REGISTRO */}
                            <AuthModal
                                defaultView="signup"
                                trigger={<Button size="sm" className="mx-5">{t('NAVBAR.MOBILE_NAV.REGISTER')}</Button>}
                            />
                        </>
                    ) : isAdmin ? (
                        <>
                            <div className="text-xs font-bold text-primary uppercase pl-8">{t('NAVBAR.MOBILE_NAV.ADMIN_PANEL')}</div>
                            <a href="/admin/users" className="text-lg font-medium pl-8">{t('NAVBAR.MOBILE_NAV.MANAGE_USERS')}</a>
                            <a href="/admin/statistics" className="text-lg font-medium pl-8">{t('NAVBAR.MOBILE_NAV.STATISTICS')}</a>
                        </>
                    ) : (
                        <>
                            <TransactionModal
                                trigger={
                                    /* We use asChild on the Modal Trigger and then asChild on the MenuLink 
                                       to ensure the final HTML is just a button with your styles */
                                    <Button className="justify-start gap-2 mx-5" size="lg" >
                                        <PlusCircle className="size-5" /> {t('NAVBAR.MOBILE_NAV.ADD_TRANSACTION')}
                                    </Button>
                                }
                            />
                            <Separator />
                            <div className="text-sm font-bold text-muted-foreground uppercase  pl-4">{t('NAVBAR.MOBILE_NAV.TRANSACTIONS')}</div>
                            <a href="/transactions/day" className="pl-8 text-md">{t('NAVBAR.MOBILE_NAV.DAILY')}</a>
                            <a href="/transactions/month" className="pl-8 text-md">{t('NAVBAR.MOBILE_NAV.MONTHLY')}</a>
                            <a href="/transactions/year" className="pl-8 text-md">{t('NAVBAR.MOBILE_NAV.YEARLY')}</a>
                            <Separator />
                            <div className="text-sm font-bold text-muted-foreground uppercase  pl-4">{t('NAVBAR.MOBILE_NAV.GRAPHS')}</div>
                            <a href="/graphs/month" className="pl-8 text-md">{t('NAVBAR.MOBILE_NAV.MONTHLY')}</a>
                            <a href="/graphs/year" className="pl-8 text-md">{t('NAVBAR.MOBILE_NAV.YEARLY')}</a>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}