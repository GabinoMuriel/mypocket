import { useTranslation } from "react-i18next";

export const Logo = () => {
    const { t } = useTranslation();

    return (
        <a href="/" className="flex items-center space-x-2">
            <img src="/assets/logos/logo_small_ts.png" className="size-9 w-auto dark:brightness-140 transition-all" alt={t('COMMON.LOGO_ALT')} />
            <span className="text-2xl font-bold text-[var(--primary)]  transition-all">MyPocket</span>
        </a>
    );
};