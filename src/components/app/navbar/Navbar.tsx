import { Button } from "@/components/ui/button";
import { NavUser } from "./NavUser";
import { NavAdmin } from "./NavAdmin";
import { UserAccountMenu } from "./UserAccountMenu";
import { MobileNav } from "./MobileNav";
import { AuthModal } from "../forms/AuthModal";
import { Logo } from "@/components/app/Logo";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

export default function Navbar() {
  // Pull user and role from the Zustand store
  const { user, role } = useAuthStore();

  // Compute the boolean values based on the exact AuthState interface
  const isLogged = !!user;
  const isAdmin = role === 'admin';
  const isPremium = role === 'premium';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        {/* GRUPO IZQUIERDA: Móvil + Logo + Nav Desktop */}
        <div className="flex items-center gap-4">
          <MobileNav isLogged={isLogged} isAdmin={isAdmin} />
          <Logo />

          <nav className="hidden lg:flex ml-4">
            {isLogged ? (isAdmin ? <NavAdmin /> : <NavUser />) : null}
          </nav>
          {isPremium && (
            <div className="ml-2 px-2 py-0.5 rounded-full bg-[var(--premium-background)] text-[var(--premium)] border border-[var(--premium)] text-[10px] font-bold uppercase tracking-wider">
              Premium
            </div>)}
          {isAdmin && (
            <div className="ml-2 px-2 py-0.5 rounded-full bg-[var(--admin-background)] text-[var(--admin)] border border-[var(--admin)] text-[10px] font-bold uppercase tracking-wider">
              Admin
            </div>)}
        </div>

        {/* GRUPO DERECHA: Siempre al final gracias al justify-between del padre */}
        <div className="flex items-center gap-1 md:gap-2 ">

          <div className="mx-1 h-4 bg-border hidden sm:block" />

          {isLogged ? (
            <UserAccountMenu />
          ) : (
            <div className="flex items-center gap-2 hidden lg:flex">
              <ThemeToggle />
              <LanguageToggle />

              {/* MODAL PARA LOGIN */}
              <AuthModal
                defaultView="login"
                trigger={<Button variant="ghost" size="sm">Entrar</Button>}
              />

              {/* MODAL PARA REGISTRO */}
              <AuthModal
                defaultView="signup"
                trigger={<Button size="sm">Registro</Button>}
              />
            </div>
          )}

        </div>
      </div>
    </header>
  );
}