import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/app/forms/AuthModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const isLogged = !!user;

  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <header className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <AuthModal
              defaultView="login"
              trigger={
                <Badge variant="outline" className="cursor-pointer">
                  {t("HOME_PAGE.HERO_SECTION.BADGE")}
                  <ArrowUpRight />
                </Badge>
              }
            />

            <h1 className="font-heading my-4 text-4xl text-balance md:text-5xl lg:leading-14">
              {t("HOME_PAGE.HERO_SECTION.TITLE")}
            </h1>
            <p className="text-muted-foreground mb-8 text-balance lg:text-lg">
              {t("HOME_PAGE.HERO_SECTION.DESCRIPTION")}
            </p>
            {isLogged ? (
              ""
            ) : (
              <div className="flex justify-center gap-2">
                <AuthModal
                  defaultView="login"
                  trigger={
                    <Button variant="ghost" size="sm">
                      {t("HOME_PAGE.HERO_SECTION.LOGIN")}
                    </Button>
                  }
                />
                <AuthModal
                  defaultView="signup"
                  trigger={
                    <Button size="sm">
                      {t("HOME_PAGE.HERO_SECTION.REGISTER")}
                    </Button>
                  }
                />
              </div>
            )}
          </header>
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/assets/landing/hero.png"
              alt="hero_img"
              className="aspect-square w-full object-cover " /* transition-transform duration-500 hover:scale-105 */
            />
          </div>
        </div>
      </div>
    </section>
  );
}
