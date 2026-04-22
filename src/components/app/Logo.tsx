import { Link } from 'react-router-dom';

export const Logo = () => {
    return (
        <Link to="/" className="flex items-center space-x-2">
            <img src="/assets/logos/logo_small_ts.png" className="size-8 dark:invert" alt="Logo de MyPocket" />
            <span className="text-2xl font-bold">MyPocket</span>
        </Link>
    );
};