import React from "react";
import styles from './Logo.module.css'
import {Link, useLocation} from "react-router-dom";

interface LogoProps {
    className?: string
}

const Logo: React.FC<LogoProps> = ({className}: LogoProps) => {

    const location = useLocation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Если уже на домашней странице, перезагружаем страницу
        if (location.pathname === '/') {
            // Отменяем переход по ссылке, чтобы избежать двойного действия
            e.preventDefault();
            window.location.reload();
        }
    };

    return (
        <Link className={`${className} ${styles.logo}`} to={`/`} onClick={handleClick}>
            Kalmykov Group
        </Link>
    )
}

export default Logo;