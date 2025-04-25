import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';
import React, {JSX} from "react";
import {PathSegment} from "../../store/header/categoriesSlice.ts";
import {ROUTES} from "../../routes/routes.ts";


interface Breadcrumbs{
    pathSegments: PathSegment[];
    activeEndSegment?: boolean;
}

const Breadcrumbs: React.FC<Breadcrumbs> = ({ pathSegments, activeEndSegment = false }) => {

    // Используем reduce для накопления пути
    const breadcrumbs = pathSegments.reduce<{ url: string; elements: JSX.Element[] }>(
        (acc, segment, index) => {

            // Обновляем накопленный путь
            const newUrl = `${acc.url}/${segment.segment}`;
            // Создаем элемент ссылки
            const breadcrumb = (index < pathSegments.length - 1) || activeEndSegment ? (

                <Link className={styles.link} to={ROUTES.CATEGORY + newUrl} key={index}>
                    {segment.name}

                    <svg className={styles.arrowIcon} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 20l-1.4-1.4 6.6-6.6-6.6-6.6L10 4l8 8z" />
                    </svg>

                </Link>

            ) : <div key={index} className={`${styles.link} ${styles.endLink}`}>{segment.name}</div>
            // Добавляем элемент в массив
            acc.elements.push(breadcrumb);
            // Возвращаем обновленные значения
            return { url: newUrl, elements: acc.elements };
        },
        { url: '', elements: [] }
    );

    return <nav className={styles.navContainer}>
                {breadcrumbs.elements}
           </nav>;
};

export default Breadcrumbs;