import {
  ChevronDown,
  ChevronUp,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useState } from "react";

export function UserAccountMenu() {
  const navigate = useNavigate();
  const [showConfig, setShowConfig] = useState(false);

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const firstName = profile?.first_name || "Usuario";
  const lastName = profile?.last_name || "Apellido";
  const email = user?.email || "usuario@email.com";
  const avatarUrl = profile?.avatar_url || "/assets/default_avatar.png";
  const initial_first_name = profile?.first_name
    ? firstName.charAt(0).toUpperCase() + "."
    : "Usuario";
  const initial_last_name = profile?.last_name
    ? lastName.charAt(0).toUpperCase() + "."
    : "";

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
            {initial_first_name}
            {initial_last_name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      {/* Adjust width slightly if needed for mobile, w-56 or w-64 */}
      <DropdownMenuContent
        className="w-64 max-h-[85vh] overflow-y-auto"
        align="end"
        forceMount
      >
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
          <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mi perfil</span>
          </DropdownMenuItem>
          {/* Expandable Configuration Trigger */}
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // Prevents the entire dropdown from closing when clicked
              setShowConfig(!showConfig);
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </div>
            {showConfig ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </DropdownMenuItem>

          {/* The Inline "Accordion" Content */}
          {showConfig && (
            <div className="bg-muted/30 rounded-md p-2 mt-1 mx-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Idioma */}
              <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">
                Idioma
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log("Changing language to Spanish")}>
                <span>Español</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Changing language to English")}>
                <span>English</span>
              </DropdownMenuItem>

              {/* Tema */}
              <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground mt-2">
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
            </div>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout Action */}
        <DropdownMenuItem
          className="text-[var(--destructive)] focus:bg-[var(--destructive)]/50 dark:focus:bg-[var(--destructive)]/50 cursor-pointer"
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
