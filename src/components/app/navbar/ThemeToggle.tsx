import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ThemeToggleProps {
    description?: boolean;
}

export function ThemeToggle({ description = false }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const { t } = useTranslation();

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <Button variant="ghost" size="icon" className="size-9" disabled />

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className="size-9 w-auto ">
                    {theme === "light" && <Sun />}
                    {theme === "dark" && <Moon />}
                    {theme === "system" && <Monitor />}
                    {description && <span className="ml-3">{t('NAVBAR.THEME_TOGGLE.CHANGE_THEME')}</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
            </DropdownMenuContent>
        </DropdownMenu>
    )
}