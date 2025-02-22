import styles from "./ProductImage.module.css";
import FavoriteButton from "../FavoriteButton/FavoriteButton.tsx";
import noImage from "../../../../assets/images/no-image.svg";
import React, {useState} from "react";
import {useAppDispatch} from "../../../../hooks/hooks.ts";
import {toggleFavoriteThunk} from "../../../../store/productSpace/wishListSlice.ts";
import {ShortProductDtoUiExtended} from "../../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";

interface ProductImageProps {
    product: ShortProductDtoUiExtended;
}

const ProductImage: React.FC<ProductImageProps> = ({ product }) => {

    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    const handleToggleFavorite = () => {
        dispatch(toggleFavoriteThunk(product));
    }

    return (
        <div className={styles.imgContainer}>

            <FavoriteButton isFavorite={product.isFavorite} onClick={handleToggleFavorite}/>

                {/* 🔹 Показать SVG-заглушку, если изображение не найдено */}
                {error && <img className={styles.mainImg} src={noImage} alt="No Image"/>}

                {/* 🔹 Анимация загрузки */}
                {loading && !error && <div className={styles.loader}></div>}

                {/* 🔹 Основное изображение */}
                <img
                    className={`${styles.mainImg} ${loading ? styles.hidden : ""}`}
                    src={product.url?.trim() ? product.url : noImage} // ✅ Проверяем `src`, если пусто – ставим `noImage`
                    alt=" "
                    loading="lazy"
                    onLoad={() => setLoading(false)} // ✅ Скрываем лоадер при загрузке
                    onError={() => {
                        setError(true); // ✅ Показываем `noImage`, если изображение не найдено
                        setLoading(false);
                    }}
                />



        </div>
    );
}

export default ProductImage;