import React, {useCallback, useEffect, useRef} from "react";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import {CategoryDtoUiExtended} from "../../api/CategorySpace/CategoryService/Ui/CategoryDtoUiExtended.ts";
import {useDispatch, useSelector} from "react-redux";
import {useInfiniteScroll} from "../../helpers/useInfiniteScroll.ts";
import styles from "./FilterProductsPage.module.css";
import ProductCard from "../../components/ProductComponents/ProductCard/ProductCard.tsx";
import {AppDispatch, LoadingStatus} from "../../store/types.ts";
import {resetFilterProductsSlice, setCategoryId} from "../../store/filterProducts/filterProductsSlice.ts";
import {
    fetchFilterProductsThunk,
    selectFilterProductsHasMore, selectFilterProductsNextPage,
    selectFilterProductsProducts,
    selectFilterProductsStatus
} from "../../store/filterProducts";
import LoadingIndicator from "../../components/ProductComponents/LoadingIndicator/LoadingIndicator.tsx";



interface CategoryPageProps {
    //При генерации маршрута передается целая категория.
    // Поэтому мы получаем не название категории, а сразу объект
    category: CategoryDtoUiExtended
}

const FilterProductsPage: React.FC<CategoryPageProps> = ({category}: CategoryPageProps) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        console.log("Reset filter products slice");
        dispatch(resetFilterProductsSlice())
    }, [dispatch, category]);


    const status = useSelector(selectFilterProductsStatus);
    const products = useSelector(selectFilterProductsProducts);
    const hasMore = useSelector(selectFilterProductsHasMore);


    const nextPageRef = useRef<number>(1); // Изначально пустая строка
    const nextPage = useSelector(selectFilterProductsNextPage);

    useEffect(() => {
        nextPageRef.current = nextPage; // Теперь `queryRef.current` всегда актуальный
    }, [nextPage]);

    //Первый запрос на получение продуктов
    useEffect(() => {

        if(products.length == 0 && hasMore && status != LoadingStatus.Loading){
            dispatch(setCategoryId(category.id));
            dispatch(fetchFilterProductsThunk({page: 1, categoryId: category.id}));
        }

    }, [dispatch, hasMore, status, products, category]);

    // Исправленный обработчик загрузки
    const handleLoadMore = useCallback(() => {
        if (status != LoadingStatus.Loading && hasMore) {

            dispatch(fetchFilterProductsThunk({page: nextPageRef.current, categoryId: category.id}));
        }
    }, [category.id, dispatch, hasMore, status]);

    // Ссылка на элемент в конце списка
    const lastElementRef = useRef<HTMLDivElement>(null);

    // Применяем кастомный хук для бесконечной прокрутки
    useInfiniteScroll<HTMLDivElement>(lastElementRef, handleLoadMore, {threshold: 0.1});

    return <>
        <Breadcrumbs pathSegments={category.pathSegments} />
        <h4>
            {category?.name}
        </h4>

        <div className={styles.productsContainer}>
            {products.map((product) =>
                <ProductCard key={product.id} product={product}/>
            )}

            {status != LoadingStatus.Loading && products.length == 0 && (
                <>
                    Not found
                </>
            )}


            {/* Разрешаем до-загрузку только, если уже есть товары. */}
            <LoadingIndicator ref={lastElementRef} visible={(hasMore && products.length > 0)}/>

        </div>
    </>
}

export default FilterProductsPage;