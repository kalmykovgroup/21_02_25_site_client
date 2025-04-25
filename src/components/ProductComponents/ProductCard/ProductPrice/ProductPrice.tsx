import {ShortProductDtoUiExtended} from "../../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import React from "react";
import styles from "./ProductPrice.module.css";

interface ProductPriceProps {
    product: ShortProductDtoUiExtended;
}

const ProductPrice: React.FC<ProductPriceProps> = ({product}) => {

    return (
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
    );
}

export default ProductPrice;