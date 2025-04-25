import {ShortProductDtoUiExtended} from "../../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import React from "react";
import styles from "./ProductName.module.css";

interface ProductNameProps {
    product: ShortProductDtoUiExtended;
}

const ProductName: React.FC<ProductNameProps> = ({product}) => {
    return (
        <div className={styles.nameContainer}>
            <div className={styles.truncatedWrapper}>
                        <span className={styles.truncated}>
                          {product.name}
                        </span>
            </div>
        </div>
    )
}

export default ProductName;