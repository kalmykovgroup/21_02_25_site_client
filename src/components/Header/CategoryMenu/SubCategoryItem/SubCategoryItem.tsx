import React, {useEffect, useRef, useState} from "react";
import styles from "./SubCategoryItem.module.css";
import {Link} from "react-router-dom";
import {ROUTES} from "../../../../routes/routes.ts";
import {CategoryDtoUiExtended} from "../../../../api/CategorySpace/CategoryService/Ui/CategoryDtoUiExtended.ts";

interface SubCategoryItemProps {
    category: CategoryDtoUiExtended;
}

const SubCategoryItem: React.FC<SubCategoryItemProps> = ({ category }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [maxHeight, setMaxHeight] = useState("0px"); // Для плавного изменения высоты
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMaxHeight(`${contentRef.current?.scrollHeight}px`);
        } else {
            setMaxHeight("0px");
        }
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };


    return (
        <>
            <Link to={`${ROUTES.CATEGORY}/${category?.pathSegments.map(segment => segment.segment).join('/')}`}
                  className={styles.groupName}>{category.name}</Link>

            <menu className={styles.group}>
                {category.subCategories.slice(0, 5).map((subCategory) => (
                    <Link key={subCategory.id}
                          to={`${ROUTES.CATEGORY}/${subCategory?.pathSegments.map(segment => segment.segment).join('/')}`}
                    >{subCategory.name}</Link>
                ))}

                {/* Блок с плавным открытием */}
                <div
                    ref={contentRef}
                    className={styles.hiddenBlock}
                    style={{ maxHeight }}
                >
                    {category.subCategories.slice(5).map((subCategory) => (
                        <Link key={subCategory.id}
                              to={`${ROUTES.CATEGORY}/${subCategory?.pathSegments.map(segment => segment.segment).join('/')}`}
                        >{subCategory.name}</Link>
                    ))}
                </div>

                {category.subCategories.length > 5 && (
                    <div className={styles.toggleButton} onClick={handleToggle}>
                        {isOpen ? (
                            <div className={styles.toggleButtonRollDown}>
                                <span>Свернуть</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="m10 8.871 4.094 4.094 1.062-1.059L10 6.75l-5.154 5.154 1.06 1.061L10 8.871z"></path>
                                </svg>
                            </div>
                        ) : (
                            <div className={styles.toggleButtonRollUp}>
                                <span>Еще</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M19.997 10.007 12 18.004l-7.997-7.997 1.414-1.414L12 15.176l6.583-6.583z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                )}
            </menu>
        </>
    );
};

export default SubCategoryItem;