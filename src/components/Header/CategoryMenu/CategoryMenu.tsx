import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store.ts";
import styles from "./CategoryMenu.module.css";
import {fetchCategoriesThunk, setIsOpenCategoryMenu} from "../../../store/header/categoriesSlice.ts";
import arrowIcon from "../../../assets/images/category/arrow.svg";
import {useEffect, useState} from "react";
import { CategoryDto } from "../../../api/CategorySpace/CategoryService/Dtos/CategoryDto.ts";
import {useNavigate} from "react-router-dom";
import {toggleScroll} from "../../../store/scrollSlice.ts";

export default function CategoryMenu() {
    const dispatch = useDispatch<AppDispatch>();
    const {categories} = useSelector((state: RootState) => state.categorySlice);

    const {isOpenCategoryMenu} = useSelector((state: RootState) => state.categorySlice);

    const [parentActiveCategory, setParentActiveCategory] = useState<CategoryDto | null>(null)


    useEffect(() => {
        dispatch(toggleScroll(!isOpenCategoryMenu));
        
        if (categories.length === 0) {
            dispatch(fetchCategoriesThunk());
        }
    }, [dispatch, categories.length, categories, isOpenCategoryMenu]);

    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

    // Функция для переключения состояния "развернуть / свернуть"
    const toggleCategory = (categoryId: string) => {
        setOpenCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const navigate = useNavigate();

    const handleCategoryClick = (category: CategoryDto) => {
        dispatch(setIsOpenCategoryMenu(false));
        navigate("/category", { state: category }); // ✅ Передаем объект через `state`
    };


    // Показывает список подкатегорий (максимум 5, если не развернуто)
    const showRecentSubCategories = (category: CategoryDto) => {
        const isOpen = openCategories[category.id] ?? false;
        const visibleCategories = category.subCategories.slice(0, isOpen ? category.subCategories.length : 5);

        return (
            <>
                <ul>
                    {visibleCategories.map((sub) => (
                        <li key={sub.id} className={styles.titleTwoSubCategory}  onClick={() => handleCategoryClick(sub)}>
                              {sub.name}
                        </li>
                    ))}
                </ul>
                {category.subCategories.length > 5 && (
                    <button onClick={() => toggleCategory(category.id)}>
                        {isOpen ? (
                            <div className={styles.toggleButtonRollDown}>
                                <span>Свернуть</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path
                                        d="m10 8.871 4.094 4.094 1.062-1.059L10 6.75l-5.154 5.154 1.06 1.061L10 8.871z"></path>
                                </svg>
                            </div>
                        ) : (
                            <div className={styles.toggleButtonRollUp}>
                                <span>Еще</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M19.997 10.007 12 18.004l-7.997-7.997 1.414-1.414L12 15.176l6.583-6.583z"></path>
                                </svg>
                            </div>
                        )}
                    </button>
                )}
            </>
        );
    };

    const subCategoriesTwoLevelOffset = (offset : number) => {
        return <>
            {parentActiveCategory?.subCategories
                .filter((_, index) => (index - offset) % 3 === 0)
                .map((category) => <div className={styles.wrapper} key={category.id}>
                    {subCategoriesTwoLevel(category)}
                </div>
                )}
           </>

    }

    const subCategoriesTwoLevel = (category: CategoryDto) => {
        return  (
                <div className={styles.categoryDownList}>
                    <a href="#" className={styles.titleOneSunCategory} onClick={() => handleCategoryClick(category)}>
                        {category.name}
                    </a>
                    <ul>
                        {showRecentSubCategories(category)}
                    </ul>
                </div>
        )

    }


    return (
        <div className={styles.categoryContainer}  style={{"display": isOpenCategoryMenu ? "block" : "none"}}>

            <div className={styles.blackout} onClick={() => dispatch(setIsOpenCategoryMenu(false))}></div>

            <div className={styles.content}>
                <div className={styles.categories}>
                    <ul className={styles.leftCategoryMenu}>
                        {categories.map((category) => (
                            <li key={category.id}  onClick={() => handleCategoryClick(category)}
                                className={`${styles.categoryItem} ${category.id === parentActiveCategory?.id ? styles.active : ""}`}
                                onMouseEnter={() => setParentActiveCategory(category)}>
                                <img src={`/src/assets/category/${category.imgUrl}`} className={`${styles.icon}`}
                                     alt=""/>
                                <span className={styles.name}>{category.name}</span>
                                <img src={arrowIcon} className={`${styles.arrowIcon}`} alt=""/>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.rightCategoryContainer}>

                            <a href="#" className={`${styles.bigTitle}`} onClick={() => handleCategoryClick(parentActiveCategory!)}>
                                {parentActiveCategory?.name}
                            </a>
                        <div>

                            <div className={styles.categoryContainer}>
                                {subCategoriesTwoLevelOffset(0)}
                                {subCategoriesTwoLevelOffset(1)}
                                {subCategoriesTwoLevelOffset(2)}
                            </div>


                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}

