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
import { useTranslation } from "react-i18next";

export function UserAccountMenu() {
  const navigate = useNavigate();
  const [showConfig, setShowConfig] = useState(false);

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const { t, i18n } = useTranslation();

  const firstName = profile?.first_name || t('NAVBAR.USER_MENU.DEFAULT_USER');
  const email = user?.email || "usuario@email.com";
  const avatarUrl = profile?.avatar_url || "/assets/default_avatar.png";


  const { setTheme } = useTheme();

      const changeLanguage = (lng: string) => {
          i18n.changeLanguage(lng);
      };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 w-auto p-0 flex items-center justify-start"
        >
          <Avatar className="h-full w-full hover:scale-105 transition-all duration-200 ease-in-out">
            <AvatarImage src={avatarUrl} alt={`@${firstName}`} />
            <AvatarFallback>{firstName}</AvatarFallback>
          </Avatar>
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
            <p className="text-sm font-medium leading-none">{t('NAVBAR.USER_MENU.MY_ACCOUNT')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{t('NAVBAR.USER_MENU.MY_PROFILE')}</span>
          </DropdownMenuItem>
          {/* Expandable Configuration Trigger */}
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // Prevents the entire dropdown from closing when clicked
              setShowConfig(!showConfig);
            }}
            className="cursor-pointer"
          >

            <Settings className="mr-2 h-4 w-4" />
            <span>{t('NAVBAR.USER_MENU.SETTINGS')}</span>

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
                {t('NAVBAR.USER_MENU.LANGUAGE')}
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => changeLanguage("es")}>
                <img
                  src="/assets/flags/es.svg"
                  alt="Spanish"
                  className="w-4 h-3"
                />
                <span>{t('NAVBAR.LANGUAGES.SPANISH')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                <img
                  src="/assets/flags/gb.svg"
                  alt="English"
                  className="w-4 h-3"
                />
                <span>{t('NAVBAR.LANGUAGES.ENGLISH')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("zh")}>
                <img
                  src="/assets/flags/cn.svg"
                  alt="Chinese"
                  className="w-4 h-3"
                />
                <span>{t('NAVBAR.LANGUAGES.CHINESE')}</span>
              </DropdownMenuItem>

              {/* Tema */}
              <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground mt-2">
                {t('NAVBAR.USER_MENU.THEME')}
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4" />
                <span>{t('NAVBAR.THEME_TOGGLE.LIGHT')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4" />
                <span>{t('NAVBAR.THEME_TOGGLE.DARK')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="h-4 w-4" />
                <span>{t('NAVBAR.THEME_TOGGLE.SYSTEM')}</span>
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
          <span>{t('NAVBAR.USER_MENU.LOGOUT')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
