import { Logo } from "@/components/app/Logo";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FooterSection() {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const email = "contact@mypocket.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Separator className="mb-6" />

        {/* Cambiado: Padding responsivo (lg:px-20) y alineación adaptable (items-center a items-start) */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-10 lg:px-20">

          {/* Logo y Eslogan */}
          {/* Cambiado: Centrado en móvil, alineado a la izquierda en desktop */}
          <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
            <Logo />
            <p className="text-muted-foreground text-sm max-w-[250px]">
              {t('HOME_PAGE.FOOTER_SECTION.SLOGAN')}
            </p>
          </div>

          {/* Contacto Minimalista */}
          {/* Cambiado: Alineación adaptable para los items de contacto */}
          <div className="flex flex-col items-center md:items-start gap-4 text-sm text-muted-foreground">
            {/* Email con Copiar */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 hover:text-foreground transition-colors group"
              title={t('HOME_PAGE.FOOTER_SECTION.COPY_HOVER')}
            >
              <Mail size={16} />
              <span>{email}</span>
              <div className="w-7 flex items-center justify-start">
                {copied ? (
                  <Check size={20} className="text-[var(--primary)]" />
                ) : (
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 bg-[var(--primary)] text-[var(--background)] px-2 py-0.5 rounded transition-opacity">
                    {t('HOME_PAGE.FOOTER_SECTION.COPY')}
                  </span>
                )}
              </div>
            </button>

            {/* Dirección */}
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{t('HOME_PAGE.FOOTER_SECTION.LOCATION')}</span>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground text-center">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} MyPocket. {t('HOME_PAGE.FOOTER_SECTION.RIGHTS')}
          </p>
        </div>
      </div>
    </footer>
  );
}