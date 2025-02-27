/*
import React, {
    useEffect,
    useCallback,
    useRef
} from "react";
import ProductCard from "../Card/ProductCard";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { fetchProductsThunk, setPage } from "../../../store/productSpace/productsSlice.ts";
import styles from "./ProductsContainer.module.css";


/!**
 * Компонент со списком товаров, подгружающихся "бесконечно" (infinite scroll).
 *!/
const ProductsContainer: React.FC = () => {
    const dispatch = useAppDispatch();

    // Достаём из Redux нужные значения
    const {
        products,
        page,
        loading,
        hasMore
    } = useAppSelector((state) => state.productsSlice);

    const query: string  = useAppSelector((state ) => state.searchSlice.query)
    const selectedCategory = useAppSelector((state ) => state.categorySlice.selectedCategory)
    
    useEffect(() => {
        if(products.length == 0 && hasMore){
            dispatch(fetchProductsThunk({ page : page, search: query, categoryId: selectedCategory?.id }));
        }
    });
    
    const getNextPage = useCallback(() => {

        const currentPage  =  page + 1;
        dispatch(setPage(currentPage));
        dispatch(fetchProductsThunk({ page: currentPage, search: query, categoryId: selectedCategory?.id }));

    }, [dispatch, page, query, selectedCategory?.id]);

    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {

        // ✅ Если загрузка или нет данных для подгрузки, выходим
        if (loading || !hasMore) return;

        // ✅ Если уже есть observer — отключаем его
        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver(
            (entries, observerInstance) => {
                if (entries[0].isIntersecting) {
                    getNextPage(); // ✅ Загружаем следующую страницу
                    observerInstance.unobserve(entries[0].target); // ✅ Остановить слежение за этим элементом
                }
            },
            { threshold: 1.0 } // ✅ Сработает только если элемент полностью в зоне видимости
        );

        if (node) observer.current.observe(node);

    }, [loading, hasMore, getNextPage]);

// ✅ Очистка `IntersectionObserver` при размонтировании
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);


    return (
        <div className={styles.productsContainer}>

            {products.map((product, index) => {
                // Для последней карточки в списке вешаем ref, чтобы ловить «конец» списка
                if (index === products.length - (products.length > 13 ? 12 : 1)) {
                    return (
                        <div ref={lastElementRef} key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    );
                } else {
                    return (
                        <ProductCard key={product.id} product={product} />
                    );
                }
            })}

            {/!* Если идёт загрузка — можем показать спиннер или лоадер *!/}
            {loading && <div className={styles.loading}>Загрузка...</div>}
        </div>
    );
};


export default ProductsContainer;
*/
