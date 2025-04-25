import {ShortProductDtoUiExtended} from "../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts"; // ✅ Импорт файла
import styles from "./ProductCard.module.css";
import mainWindowProductsStyles from "../../../pages/Home/MainWindowProducts/MainWindowProducts.module.css";
import React from "react";
import ProductImage from "./ProductImage/ProductImage.tsx";
import ProductPrice from "./ProductPrice/ProductPrice.tsx";
import ProductName from "./ProductName/ProductName.tsx";

interface ProductCardProps {
    product: ShortProductDtoUiExtended;
}



const ProductCard: React.FC<ProductCardProps> = ({product}) => {

    return (

        <div className={`${styles.productItem} ${mainWindowProductsStyles.productItem}`}>

            <div className={`${styles.productContent} ${mainWindowProductsStyles.productContent}`}>

                <ProductImage product={product}/>

                <ProductName product={product}/>

                <ProductPrice product={product}/>

            </div>

        </div>

    )
        ;
};

export default ProductCard;
