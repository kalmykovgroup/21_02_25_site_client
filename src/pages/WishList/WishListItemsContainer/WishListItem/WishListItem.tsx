
import styles from "./WishListItem.module.css";
import React  from "react";
import {ShortProductDtoUiExtended} from "../../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import ProductImage from "../../../../components/ProductsContainer/Card/ProductImage/ProductImage.tsx";

interface WishListItemProps {
    product: ShortProductDtoUiExtended;
}

const WishListItem: React.FC<WishListItemProps> = ({ product }) => {

    return (

        <div className={styles.wishListItemContainer}>



                  <ProductImage product={product} />



                <div className={`${styles.nameContainer}`}>

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

    )
        ;
};

export default WishListItem;
