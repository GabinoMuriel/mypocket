import { Button } from "@/components/ui/button";
import { NavUser } from "./NavUser";
import { NavAdmin } from "./NavAdmin";
import { UserAccountMenu } from "./UserAccountMenu";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { AuthModal } from "../forms/auth-modal";

const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

const Logo = () => {
  return (
    <Link href="#" className="flex items-center space-x-2">
      <img src="/assets/logos/logo_small_ts.png" className="size-8 dark:invert" alt="bundui logo" />
      <span className="text-2xl font-bold">MyPocket</span>
    </Link>
  );
};

export default function Navbar() {

  const isLogged = true;
  const isAdmin = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        {/* GRUPO IZQUIERDA: Móvil + Logo + Nav Desktop */}
        <div className="flex items-center gap-4">
          <MobileNav isLogged={isLogged} isAdmin={isAdmin} />
          <Logo />
          <nav className="hidden lg:flex ml-4">
            {isLogged ? (isAdmin ? <NavAdmin /> : <NavUser />) : ''}
          </nav>
        </div>

        {/* GRUPO DERECHA: Siempre al final gracias al justify-between del padre */}
        <div className="flex items-center gap-1 md:gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <div className="mx-1 h-4 w-px bg-border hidden sm:block" />

          {isLogged ? (
            <UserAccountMenu />
          ) : (
            <div className="flex items-center gap-2">
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
