import { useDispatch, useSelector } from "react-redux";
import styles from "./CategoryMenu.module.css";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import SubCategoryItem from "./SubCategoryItem/SubCategoryItem.tsx";
import useRouteChange from "../../../routes/useRouteChange.ts";
import {ROUTES} from "../../../routes/routes.ts";
import {CategoryDtoUiExtended} from "../../../api/CategorySpace/CategoryService/Ui/CategoryDtoUiExtended.ts";
import {AppDispatch} from "../../../store/types.ts";
import {
    selectCategories,
    selectCategoriesIsOpenCategoryMenu
} from "../../../store/categories";
import {setIsOpenCategoryMenu} from "../../../store/categories/categoriesSlice.ts";

export default function CategoryMenu() {
    const dispatch = useDispatch<AppDispatch>();


    const isOpenCategoryMenu = useSelector(selectCategoriesIsOpenCategoryMenu);
    const categories = useSelector(selectCategories);

    const [parentActiveCategory, setParentActiveCategory] = useState<CategoryDtoUiExtended | null>(null)
 

    useRouteChange(useCallback(() => {
        dispatch(setIsOpenCategoryMenu(false));
    }, [dispatch]));
  
    useEffect(() => {
        //dispatch(toggleScroll(!isOpenCategoryMenu));

    });


    const columns = useMemo(() => {
        const cols: CategoryDtoUiExtended[][] = [[], [], []];

        if (parentActiveCategory?.subCategories) {
            // Сначала сортируем по полю index
            const sortedSubCategories = [...parentActiveCategory.subCategories].sort((a, b) => a.index - b.index);

            // Затем распределяем по колонкам
            sortedSubCategories.forEach((item, index) => {
                cols[index % 3].push(item);
            });
        }

        return cols;
    }, [parentActiveCategory]);



    return (
        <div className={styles.categoryContainer}  style={{"display": isOpenCategoryMenu ? "block" : "none"}}>

            <div className={styles.blackout} onClick={() => dispatch(setIsOpenCategoryMenu(false))}></div>

            <div className={styles.content}>

                <menu className={styles.listNamesParentCategories}>
                    {categories.map((category) => (

                            <Link className={`${styles.listNamesParentCategories__item} ${category.id === parentActiveCategory?.id ? styles.active : ""}`}
                                  onMouseEnter={() => setParentActiveCategory(category)}
                                  key={category.id}
                                  to={`${ROUTES.CATEGORY}/${category?.pathSegments.map(segment => segment.segment).join('/')}`}>

                                <img src={category.icon} className={`${styles.icon}`} alt=""/>

                                <span className={styles.name}>{category.name}</span>

                                <svg className={styles.arrowIcon} viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 20l-1.4-1.4 6.6-6.6-6.6-6.6L10 4l8 8z"/>
                                </svg>

                            </Link>
                    ))}
                </menu>

                <menu className={styles.activeCategoryContainer}>

                    <div className={styles.activeCategoryContainer__title}>
                        <Link to={`${ROUTES.CATEGORY}/${parentActiveCategory?.pathSegments.map(segment => segment.segment).join('/')}`}>
                            {parentActiveCategory?.name}
                        </Link>
                    </div>



                    <menu className={styles.activeCategoryContainer__item}>
                        {columns[0].map((category) =>
                            <SubCategoryItem key={category.id} category={category}/>)}
                    </menu>

                    <menu className={styles.activeCategoryContainer__item}>
                        {columns[1].map((category) =>
                            <SubCategoryItem key={category.id} category={category}/>)}
                    </menu>

                    <menu className={styles.activeCategoryContainer__item}>
                        {columns[2].map((category) =>
                            <SubCategoryItem key={category.id} category={category}/>)}
                    </menu>
                </menu>

            </div>
        </div>

    );
}

