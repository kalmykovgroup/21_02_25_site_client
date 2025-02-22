
import noImage from "../../../assets/images/no-image.svg";
import {ShortProductDtoUiExtended} from "../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts"; // ✅ Импорт файла
import styles from "./ProductCard.module.css";
import {useAppDispatch} from "../../../hooks/hooks.ts";
import React, {useState} from "react";
import {toggleFavoriteThunk} from "../../../store/productSpace/wishListSlice.ts";
import FavoriteButton from "./FavoriteButton/FavoriteButton.tsx";
import ProductImage from "./ProductImage/ProductImage.tsx";

interface ProductCardProps {
    product: ShortProductDtoUiExtended;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {


    return (

        <div className={styles.productItem}>

            <div className={styles.productContent}>

                <ProductImage product={product} />


                <div className={`${styles.name}`}>

                    <div className={styles.imgIllusion}/>

                    <p>{product.name}</p>
                </div>

                <div className={styles.priceContainer}>

                    {product.discountPercentage == null ? (
                         <span className={styles.notDiscountPercentage}>
                             {product.price}₽
                         </span>
                    ) : (
                        <>
                            <span className={styles.originalPrice}>
                              {product.originalPrice}₽
                            </span>

                            <div
                                className={`${styles.price} ${product.discountPercentage && product.discountPercentage > 40 ? product.discountPercentage > 60 ? styles.percent60_80 : styles.percent40_60 : styles.percent0_40}`}>
                                {product.price}₽
                            </div>
                        </>
                    )}


                </div>


            </div>

        </div>

    )
        ;
};

export default ProductCard;
