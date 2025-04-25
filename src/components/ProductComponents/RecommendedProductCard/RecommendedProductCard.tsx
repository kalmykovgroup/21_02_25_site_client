import styles from "./RecommendedProductCard.module.css";
import mainWindowProductsStyles from "../../../pages/Home/MainWindowProducts/MainWindowProducts.module.css";
import React from "react";
import ProductImage from "../ProductCard/ProductImage/ProductImage.tsx";
import ProductPrice from "../ProductCard/ProductPrice/ProductPrice.tsx";
 import {ShortProductDtoUiExtended} from "../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";

interface RecommendedProductCardProps {
    product: ShortProductDtoUiExtended;
}



const RecommendedProductCard: React.FC<RecommendedProductCardProps> = ({product}) => {

    return (

        <div className={`${styles.productItem} ${mainWindowProductsStyles.productItem}`}>

            <div className={`${styles.productContent} ${mainWindowProductsStyles.productContent}`}>

                <ProductImage product={product}/>

                <ProductPrice product={product}/>


            </div>

        </div>

    )

};

export default RecommendedProductCard;
