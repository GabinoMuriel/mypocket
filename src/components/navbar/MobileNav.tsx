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

export function MobileNav({ isLogged, isAdmin }: { isLogged: boolean; isAdmin: boolean }) {
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
                    <SheetTitle className="text-left">MyPocket</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 py-6">
                    {/* Lógica de links según el estado */}
                    {!isLogged ? (
                        <>
                            <a href="#" className="text-lg font-semibold pl-8">Inicio</a>
                            <a href="#" className="text-lg font-semibold text-muted-foreground pl-8">Características</a>
                            <a href="#" className="text-lg font-semibold text-muted-foreground pl-8">Precios</a>
                            <Separator />
                            <Button w-full >Registrarse</Button>
                            <Button variant="outline" w-full>Entrar</Button>
                        </>
                    ) : isAdmin ? (
                        <>
                            <div className="text-xs font-bold text-primary uppercase pl-8">Admin Panel</div>
                            <a href="/admin/users" className="text-lg font-medium pl-8">Gestión Usuarios</a>
                            <a href="/admin/stats" className="text-lg font-medium pl-8">Estadísticas</a>
                        </>
                    ) : (
                        <>
                            <Button className="justify-start gap-2" size="lg">
                                <PlusCircle className="size-5" /> Añadir Transacción
                            </Button>
                            <Separator />
                            <div className="text-sm font-bold text-muted-foreground uppercase  pl-4">Transacciones</div>
                            <a href="/t/diarias" className="pl-8 text-md">Diarias</a>
                            <a href="/t/mensuales" className="pl-8 text-md">Mensuales</a>
                            <a href="/t/anuales" className="pl-8 text-md">Anuales</a>
                            <Separator />
                            <div className="text-sm font-bold text-muted-foreground uppercase  pl-4">Gráficas</div>
                            <a href="/g/diarios" className="pl-8 text-md">Diarios</a>
                            <a href="/g/mensuales" className="pl-8 text-md">Mensuales</a>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}