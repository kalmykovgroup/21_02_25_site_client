
import styles from "./WishListItemsContainer.module.css";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store.ts";
import WishListItem from "./WishListItem/WishListItem.tsx";

const WishListItemsContainer: React.FC = ( ) => {

    const { wishList, isLoading} = useSelector((state: RootState) => state.wishListSlice);


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
