import React, {useCallback, useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/hooks.ts";
import {useDevice} from "../../../utils/DeviceContext.tsx";
import {useInfiniteScroll} from "../../../helpers/useInfiniteScroll.ts";
import styles from "./MainWindowProducts.module.css";
import RecommendedProductCard
    from "../../../components/ProductComponents/RecommendedProductCard/RecommendedProductCard.tsx";
import ProductCard from "../../../components/ProductComponents/ProductCard/ProductCard.tsx";

import {
    fetchMainWindowProductsThunk,
    selectMainWindowProducts,
    selectMainWindowProductsHasMoreProducts,
    selectMainWindowProductsNextPage,
    selectMainWindowProductsRecommendedGroupsDto,
    selectMainWindowProductsStatus
} from "../../../store/mainWindowProducts";
import {LoadingStatus} from "../../../store/types.ts";
import LoadingIndicator from "../../../components/ProductComponents/LoadingIndicator/LoadingIndicator.tsx";


/**
 * Компонент со списком товаров, подгружающихся "бесконечно" (infinite scroll).
 */
const MainWindowProducts: React.FC = () => {
    const dispatch = useAppDispatch();

    const status = useAppSelector(selectMainWindowProductsStatus);
    const products = useAppSelector(selectMainWindowProducts);
    const hasMoreProducts = useAppSelector(selectMainWindowProductsHasMoreProducts);
    const recommendedGroupsDto = useAppSelector(selectMainWindowProductsRecommendedGroupsDto);
   // const hasMoreRecommendedGroups = useAppSelector(selectMainWindowProductsHasMoreRecommendedGroups);
    const nextPage = useAppSelector(selectMainWindowProductsNextPage);


    const {isDesktop, isTablet} = useDevice()

    const statusRef = useRef<LoadingStatus>(status);
    const hasMoreProductsRef = useRef<boolean>(hasMoreProducts);

    useEffect(() => {
        hasMoreProductsRef.current = hasMoreProducts
    }, [hasMoreProducts]);

    useEffect(() => {
        hasMoreProductsRef.current = hasMoreProducts
    }, [hasMoreProducts]);

    useEffect(() => {
        statusRef.current = status
    }, [status]);

    useEffect(() => {
        if(products.length == 0 && statusRef.current != LoadingStatus.Loading){
            dispatch(fetchMainWindowProductsThunk({ page : 1 }));
        }
    }, [statusRef, products.length, hasMoreProductsRef, dispatch]);


    // Исправленный обработчик загрузки
    const handleLoadMore = useCallback(() => {
        if (status != LoadingStatus.Loading && hasMoreProducts) {
            dispatch(fetchMainWindowProductsThunk({ page: nextPage }));
        }
    }, [status, hasMoreProducts, nextPage, dispatch]);

    /*  useEffect(() => {
          // Если после загрузки контента высота страницы меньше окна, грузим ещё данные
          if (document.documentElement.scrollHeight <= window.innerHeight && hasMoreProducts && !loading) {
              handleLoadMore();
          }
      }, [products, hasMoreProducts, loading, handleLoadMore]);*/

    // Ссылка на элемент "sentinel" в конце списка
    const lastElementRef = useRef<HTMLDivElement>(null);

    // Применяем кастомный хук для бесконечной прокрутки
    useInfiniteScroll<HTMLDivElement>(lastElementRef, handleLoadMore, { threshold: 0.1 });

    let offset = -1;

    return (
        <>
            status: {status}
        <div className={`${styles.container} ${isDesktop ? styles.desktop : isTablet ? styles.tablet : styles.mobile}`}>

            {recommendedGroupsDto.map((group, idx) => {

                let gridColumnStart; //Для пк по умолчанию
                offset += 2

                if(isDesktop){
                    gridColumnStart = idx % 2 === 0 ? 1 : 5
                }
                else if(isTablet){
                    gridColumnStart = idx % 2 === 0 ? 1 : 3
                }
                else{
                    if(idx != 0) offset += 2
                    gridColumnStart = 1
                }

                return <div style={{
                    gridColumnStart: gridColumnStart,
                    gridRowStart: offset,
                    background: group.background ?? "#000000",
                    color: group.color
                }}
                            key={`featured-${idx}`} className={styles.recommendedGroup}>
                    <div className={styles.title}>
                        <div className={styles.left}>
                            <div className={styles.leftTop}>
                                Рекомендуем вам
                            </div>
                            <div className={styles.leftBottom}>
                                {group.title}
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.all}>
                                <span>Все</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                            </div>
                        </div>

                    </div>
                    <div className={styles.featuredProducts}>
                        {group.products.map((p) => (
                            <RecommendedProductCard key={p.id} product={p}/>
                        ))}
                    </div>
                </div>
            })}

            {products.map((p) =>

                <ProductCard key={p.id} product={p}/>
            )}
            {/* Сторожевой элемент всегда в конце списка */}


            <LoadingIndicator ref={lastElementRef} visible={hasMoreProducts && products.length > 0} />

        </div>
        </>
    );
};


export default MainWindowProducts;