import React from "react";
import WishListItemsContainer from "./WishListItemsContainer/WishListItemsContainer.tsx";


const WishList: React.FC = () => {



    return (
        <div>
            <h2>Избранные товары</h2>
             <WishListItemsContainer/>
        </div>
    );
};

export default WishList;