
import styles from "./WishListItem.module.css";
import React  from "react";
import {ShortProductDtoUiExtended} from "../../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import ProductImage from "../../../../components/ProductComponents/ProductCard/ProductImage/ProductImage.tsx";
import ProductPrice from "../../../../components/ProductComponents/ProductCard/ProductPrice/ProductPrice.tsx";
import ProductName from "../../../../components/ProductComponents/ProductCard/ProductName/ProductName.tsx";

interface WishListItemProps {
    product: ShortProductDtoUiExtended;
}

const WishListItem: React.FC<WishListItemProps> = ({ product }) => {

    return (

        <div className={styles.wishListItemContainer}>
                <ProductImage product={product} />

                <ProductName product={product} />

                <ProductPrice product={product}/>
        </div>

    )
        ;
};

export default WishListItem;
