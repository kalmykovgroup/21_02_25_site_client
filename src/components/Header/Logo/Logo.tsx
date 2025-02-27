import React from "react";
import styles from './Logo.module.css'
import {Link} from "react-router-dom";

interface LogoProps {
    className?: string
}

const Logo: React.FC<LogoProps> = ({className}: LogoProps) => {
    return (
        <Link className={`${className} ${styles.logo}`} to={`/`}>
            Kalmykov Group
        </Link>
    )
}

export default Logo;