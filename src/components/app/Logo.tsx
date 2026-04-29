export const Logo = () => {
    return (
        <a href="/" className="flex items-center space-x-2">
            <img src="/assets/logos/logo_small_ts.png" className="size-9 w-auto dark:brightness-140 transition-all" alt="Logo de MyPocket" />
            <span className="text-2xl font-bold text-[var(--primary)]  transition-all">MyPocket</span>
        </a>
    );
};