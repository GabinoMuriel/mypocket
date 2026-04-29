import { useTranslation } from "react-i18next";

const LogoLoader = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/50 backdrop-blur-sm">
      <div className="relative w-32 h-32 perspective-1000">
        <img
          src="/assets/logos/logo_small_ts.png"
          alt={t('COMMON.LOADING')}
          className="w-full h-full object-contain dark:brightness-140 transition-all"
        />
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[var(--primary)] mt-40">
          {t('COMMON.LOADING')}
        </span>
      </div>
    </div>
  );
};

export default LogoLoader;
