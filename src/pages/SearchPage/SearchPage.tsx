import React, {useCallback, useEffect, useRef} from "react";
import styles from "./SearchPage.module.css";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ROUTES} from "../../routes/routes.ts";

import ProductCard from "../../components/ProductComponents/ProductCard/ProductCard.tsx";

import {useInfiniteScroll} from "../../helpers/useInfiniteScroll.ts";
import {AppDispatch, LoadingStatus, SearchGetParam} from "../../store/types.ts";
import {
    fetchSearchProductsThunk, selectHasMore, selectNextPage, selectSearchEndQuery,
    selectSearchResults,
    selectSearchStatus
} from "../../store/search";
import {clearSearchResults} from "../../store/search/searchResultsSlice.ts";
import {setQuery} from "../../store/search/searchSlice.ts";
import LoadingIndicator from "../../components/ProductComponents/LoadingIndicator/LoadingIndicator.tsx";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const products = useSelector(selectSearchResults);
    const status = useSelector(selectSearchStatus);
    //  const error = useSelector(selectSearchError);
    const hasMore = useSelector(selectHasMore);

    const nextPageRef = useRef<number>(1); // Изначально пустая строка
    const nextPage = useSelector(selectNextPage);

    useEffect(() => {
        nextPageRef.current = nextPage; // Теперь `queryRef.current` всегда актуальный
    }, [nextPage]);

    const request = useQuery();
    const searchGetParam = request.get(SearchGetParam.QUERY);

    const searchValue: string | undefined = searchGetParam == null || searchGetParam.trim() === "" ? undefined : searchGetParam.trim();

    if (!searchValue) {
        navigate(ROUTES.ERROR_SCREEN, {
            state: {
                error: {
                    message: "Поисковое значение не указано",
                    stack: "",
                    name: ""
                }
            },
            replace: true
        });
    }

    const endQueryRef = useRef<string>(""); // Изначально пустая строка
    const endQuery = useSelector(selectSearchEndQuery); // Теперь обновляется при изменении `store`

    useEffect(() => {
        endQueryRef.current = endQuery; // Теперь `queryRef.current` всегда актуальный
    }, [endQuery]);

    useEffect(() => {
        if(searchValue != endQueryRef.current){
            console.log("Сбрасываем предыдущий запрос");

            dispatch(clearSearchResults());
            dispatch(setQuery(searchValue!));
            //Первый запрос. Указываем  page: 1. Если указать nextPage, то оно не будет верным, так как
            // dispatch(setQuery(searchValue!)); не успеет сбросить значение от предыдущих запросов.
            dispatch(fetchSearchProductsThunk({query: searchValue!, page: 1}));
        }else{
            console.log("Данные из кеш");
            dispatch(setQuery(endQueryRef.current));
        }
    }, [dispatch, endQueryRef, searchValue]);

    // Исправленный обработчик загрузки
    const handleLoadMore = useCallback(() => {

        if (status != LoadingStatus.Loading && hasMore) {
            dispatch(fetchSearchProductsThunk({query: searchValue!, page: nextPageRef.current}));
        }
    }, [dispatch, hasMore, searchValue, status]);


    useEffect(() => {
        return () => {
            console.log("Размонтирование SearchPage");
            dispatch(setQuery(""))
        };
    }, [dispatch]);

    // Ссылка на элемент в конце списка
    const lastElementRef = useRef<HTMLDivElement>(null);

    // Применяем кастомный хук для бесконечной прокрутки
    useInfiniteScroll<HTMLDivElement>(lastElementRef, handleLoadMore, {threshold: 0.1});



    return (
        <>
            <div className={styles.foundProductsContainer}>
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
            </div>
        </>
    );
};

export default SearchPage;
