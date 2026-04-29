import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/app/forms/AuthModal";
import { useAuthStore } from "@/store/useAuthStore";

export default function HeroSection() {
  const { user } = useAuthStore();
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
                  💸 Empieza a ahorrar
                  <ArrowUpRight />
                </Badge>
              }
            />

            <h1 className="font-heading my-4 text-4xl text-balance md:text-5xl lg:leading-14">
              Controla tus finanzas sin esfuerzo.
            </h1>
            <p className="text-muted-foreground mb-8 text-balance lg:text-lg">
              Gestiona tus ingresos y gastos con MyPocket. Sencillo, visual y
              accesible desde cualquier dispositivo.
            </p>
            {isLogged ? (
              ""
            ) : (
              <div className="flex justify-center gap-2">
                <AuthModal
                  defaultView="login"
                  trigger={
                    <Button variant="ghost" size="sm">
                      Entrar
                    </Button>
                  }
                />
                <AuthModal
                  defaultView="signup"
                  trigger={<Button size="sm">Registro</Button>}
                />
              </div>
            )}
          </header>
          <img
            src="/assets/landing/mobile_pc.png"
            alt="hero_img"
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
