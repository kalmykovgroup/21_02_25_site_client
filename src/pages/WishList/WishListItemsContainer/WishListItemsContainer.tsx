
import styles from "./WishListItemsContainer.module.css";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";
import {syncWishListWithServer} from "../../../store/productSpace/wishListSlice.ts";
import WishListItem from "./WishListItem/WishListItem.tsx";

const WishListItemsContainer: React.FC = ( ) => {

    const dispatch = useDispatch<AppDispatch>();
    const { wishList, isLoading} = useSelector((state: RootState) => state.wishListSlice);

    useEffect(() => {
        if(wishList.length == 0){
            dispatch(syncWishListWithServer());
        }
    }, [dispatch, wishList.length]);

    if (isLoading) return <p>Загрузка избранного...</p>;


    return (
        <div className={styles.wishListItemsContainer}>

            {wishList.map((product) => {
                // Для последней карточки в списке вешаем ref, чтобы ловить «конец» списка

               return ( <WishListItem key={product.id} product={product} />)

            })}

            {/* Если идёт загрузка — можем показать спиннер или лоадер */}
            {isLoading && <div className={styles.loading}>Загрузка...</div>}
        </div>
    );
};

export default WishListItemsContainer;
