import {
  Languages,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";

export function UserAccountMenu() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const firstName = profile?.first_name || "Usuario";
  const lastName = profile?.last_name || "Apellido";
  const email = user?.email || "usuario@email.com";
  const avatarUrl = profile?.avatar_url || "/assets/default_avatar.png";
  const initial_first_name = profile?.first_name ? firstName.charAt(0).toUpperCase() + "." : "Usuario";
  const initial_last_name = profile?.last_name ? lastName.charAt(0).toUpperCase() + "." : "";

  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-auto flex items-center justify-start gap-2 px-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={`@${firstName}`} />
            <AvatarFallback>{firstName}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium w-7">
            {initial_first_name}{initial_last_name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Header Section */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Mi Cuenta</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Profile Link */}
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Mi perfil</span>
          </DropdownMenuItem>

          {/* Configuration Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-48">
                {/* Language Section Inside Submenu */}
                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">
                  Idioma
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleLanguageChange("es")}>
                  <span>Español</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                  <span>English</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Theme Section Inside Submenu */}
                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">
                  Tema
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Claro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Oscuro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Sistema</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout Action */}
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          onClick={async () => {
            try {
              await authService.signout();
            } catch (error) {
              console.error("SignOut failed:", error);
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
