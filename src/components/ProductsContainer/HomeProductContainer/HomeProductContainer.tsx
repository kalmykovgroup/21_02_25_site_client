import React, {
    useEffect,
    useCallback,
    useRef, JSX
} from "react";
import ProductCard from "../Card/ProductCard";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import styles from "./HomeProductContainer.module.css";
import {fetchHomeProductsThunk, setHomePage} from "../../../store/productSpace/homeProductContainerSlice.ts";
import {useDevice} from "../../../DeviceContext.tsx";


/**
 * Компонент со списком товаров, подгружающихся "бесконечно" (infinite scroll).
 */
const HomeProductsContainer: React.FC = () => {
    const dispatch = useAppDispatch();

    // Достаём из Redux нужные значения
    const {
        loading,
        products,
        hasMoreProducts,
        recommendedGroupsDto,
        hasMoreRecommendedGroups,
        page,
    } = useAppSelector((state) => state.homeProductsContainerSlice);


    const {isDesktop, isTablet} = useDevice()

    useEffect(() => {
        if(products.length == 0 && hasMoreProducts && hasMoreRecommendedGroups){
            dispatch(fetchHomeProductsThunk({ page : page }));
        }
    });

    const getNextPage = useCallback(() => {

        const currentPage  =  page + 1;
        dispatch(setHomePage(currentPage));
        dispatch(fetchHomeProductsThunk({ page: currentPage }));

    }, [dispatch, page,]);

    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef  = useCallback((node: HTMLDivElement | null) => {

        // ✅ Если загрузка или нет данных для подгрузки, выходим
        if (loading || !hasMoreProducts || !hasMoreRecommendedGroups) return;

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

    }, [loading, hasMoreRecommendedGroups, hasMoreProducts, getNextPage]);

// ✅ Очистка `IntersectionObserver` при размонтировании
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    let acc1 = 0;
    let acc2 = 0;
    let flag = false;
    let featuredGroupIndex = 0;
    let isAddRec = false;
    return (
        <div className={styles.gridContainer}>

            {products.reduce((acc: JSX.Element[], product, index) => {

                if (acc1 == (isDesktop ? 12 : isTablet ? 6 : 6)) {
                    flag = true;
                    isAddRec = true;
                }

                if(acc2 == (isDesktop ? 4 : isTablet ? 2 : 2)){
                    acc2 = 0;
                    acc1 = 0;
                    flag = false;
                    isAddRec = true;
                }

                if(flag) acc2++;
                acc1++
                console.log(`test: ${featuredGroupIndex} | ${recommendedGroupsDto.length} | ${products.length} | ${index}`)


                if((isAddRec || index == 0) && (featuredGroupIndex < recommendedGroupsDto.length)){
                    isAddRec = false;
                    const featuredGroup = recommendedGroupsDto[featuredGroupIndex];
                    featuredGroupIndex += 1;
                    acc.push(
                        <div style={{background: featuredGroup.background ?? "#000000", color: featuredGroup.color}} key={`featured-${index}`} className={styles.featuredBlock}>
                            <div className={styles.title}>
                                <div className={styles.left}>
                                    <div className={styles.leftTop}>
                                        Рекомендуем вам
                                    </div>
                                    <div className={styles.leftBottom}>
                                        {featuredGroup.title}
                                    </div>
                                </div>
                                <div className={styles.right}>
                                    <div className={styles.all}>
                                        <span>Все</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2"
                                                  stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>

                                    </div>
                                </div>

                            </div>
                            <div className={styles.featuredProducts}>
                                {featuredGroup.products.map((p) => (
                                    <ProductCard key={p.id} product={p}/>
                                ))}
                            </div>
                        </div>
                    );
                }

                const ref = index === products.length - 1 ? lastElementRef : null;

                acc.push(
                    <div key={product.id} ref={ref} className={styles.product}>
                        {`${index}`}
                        <ProductCard product={product}/>
                    </div>
                );

                return acc;
            }, [])}

        </div>
    );
};


export default HomeProductsContainer;
