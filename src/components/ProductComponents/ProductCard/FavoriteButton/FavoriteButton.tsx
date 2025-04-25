import { motion } from "framer-motion";
import styles from "./FavoriteButton.module.css";
import React, {useMemo} from "react";
import {ShortProductDtoUiExtended} from "../../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";

import {useAppDispatch} from "../../../../hooks/hooks.ts";
import {useSelector} from "react-redux";
import {toggleFavoriteThunk} from "../../../../store/wishList";
import {RootState} from "../../../../store/types.ts";

interface FavoriteButtonProps {
    product: ShortProductDtoUiExtended;
}


const FavoriteButton: React.FC<FavoriteButtonProps> = ({ product }) => {

    const wishList = useSelector((state: RootState) => state.wishList.wishList);
    const isFavorite = useMemo(() => wishList.some((item) => item.id === product.id), [wishList, product.id]);

    const dispatch = useAppDispatch();
 

    const toggleFavorite =  () => {

        dispatch(toggleFavoriteThunk(product))
    }

    return (
        <div className={styles.favoriteContainer}>
            <motion.div
                className="relative flex items-center justify-center cursor-pointer"
                onClick={() => toggleFavorite()}
            >
                <motion.div
                    layout // ✅ Позволяет `framer-motion` правильно изменять размеры без дерганий
                    initial={{scale: 1}}
                    animate={
                        isFavorite
                            ? {scale: [1, 1.3, 1], originX: 0.5, originY: 0.5} // ✅ Увеличение из центра
                            : {scale: 1} // ❌ Без анимации при удалении
                    }
                    transition={{duration: 0.3, ease: "easeOut"}} // ⏳ Плавное увеличение и уменьшение
                    className={`text-2xl transition-colors duration-150 ${isFavorite ? "text-red-500" : "text-gray-400"}`} // ✅ Меняем цвет плавно
                >
                    <svg className={isFavorite ? styles.active : ""} xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 22 21">
                        <path
                              d="M16.226 14.753A41 41 0 0111 18.934a41 41 0 01-5.226-4.181c-1.253-1.194-2.463-2.534-3.355-3.915C1.52 9.448 1 8.099 1 6.87c0-3.678 2.548-5.496 5.024-5.496 1.592 0 3.109.74 4.203 2.071l.773.94.772-.94c1.09-1.327 2.61-2.071 4.204-2.071C18.452 1.375 21 3.193 21 6.871c0 1.228-.52 2.576-1.419 3.967-.892 1.38-2.102 2.722-3.355 3.915z"/>
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default FavoriteButton;
